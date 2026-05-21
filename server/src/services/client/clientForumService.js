const ForumPost = require('../../models/ForumPost');
const ForumPurchase = require('../../models/ForumPurchase');
const ForumReview = require('../../models/ForumReview');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const fs = require('fs');
const path = require('path');
const notificationService = require('./clientNotificationService');

const deleteFile = (filePath) => {
    if (!filePath) return;
    try {
        let fullPath = '';
        if (filePath.startsWith('/uploads/')) {
            fullPath = path.join(__dirname, '../../../public', filePath);
        } else {
            fullPath = path.join(__dirname, '../../../storage/forum-sources', filePath);
        }
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (err) {
        console.error('Lỗi khi xóa file:', err);
    }
};

exports.createPost = async (userId, body, files) => {
    const pendingCount = await ForumPost.countDocuments({ sellerId: userId, status: 'pending' });
    if (pendingCount >= 3) {
        const err = new Error('Bạn đã đạt giới hạn tối đa 3 bài đăng chờ duyệt.');
        err.statusCode = 400;
        throw err;
    }

    const { title, description, shortDescription, price, category, tags } = body;

    if (!files || !files.forumSourceFile) {
        const err = new Error('Bắt buộc phải có file source code (zip/rar)!');
        err.statusCode = 400;
        throw err;
    }

    const sourceFilePath = files.forumSourceFile[0].filename;

    let thumbnailPath = '';
    if (files.forumThumbnail && files.forumThumbnail.length > 0) {
        thumbnailPath = '/uploads/forum-thumbnails/' + files.forumThumbnail[0].filename;
    }

    let demoImagesPaths = [];
    if (files.forumDemoImages && files.forumDemoImages.length > 0) {
        demoImagesPaths = files.forumDemoImages.map(file => '/uploads/forum-thumbnails/' + file.filename);
    }

    let parsedTags = [];
    if (tags) {
        try { parsedTags = JSON.parse(tags); } catch { parsedTags = tags.split(',').map(t => t.trim()); }
    }

    const newPost = new ForumPost({
        title,
        description,
        shortDescription,
        price: Number(price),
        category: category || 'Khác',
        tags: parsedTags,
        thumbnail: thumbnailPath,
        demoImages: demoImagesPaths,
        filePath: sourceFilePath,
        sellerId: userId,
        status: 'pending'
    });

    await newPost.save();

    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
        await Promise.all(admins.map(admin =>
            notificationService.createNotification({
                userId: admin._id,
                type: 'SYSTEM',
                title: 'Bài đăng diễn đàn mới',
                message: `Có một bài đăng mới "${title}" đang chờ duyệt.`
            })
        ));
    }

    return newPost;
};

exports.addReview = async (postId, userId, data) => {
    const hasPurchased = await ForumPurchase.findOne({ postId, userId });
    if (!hasPurchased) {
        const err = new Error('Bạn cần mua mã nguồn này để có thể đánh giá');
        err.statusCode = 403;
        throw err;
    }

    const { rating, comment } = data;

    const newReview = new ForumReview({
        postId,
        userId,
        rating: Number(rating),
        comment
    });

    try {
        await newReview.save();
    } catch (e) {
        if (e.code === 11000) {
            const err = new Error('Bạn đã đánh giá mã nguồn này rồi');
            err.statusCode = 400;
            throw err;
        }
        throw e;
    }

    const post = await ForumPost.findById(postId);
    if (post && post.sellerId) {
        const allReviewsForSeller = await ForumReview.aggregate([
            {
                $lookup: {
                    from: 'forum_posts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            { $unwind: '$post' },
            { $match: { 'post.sellerId': post.sellerId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (allReviewsForSeller.length > 0) {
            const stats = allReviewsForSeller[0];
            await User.findByIdAndUpdate(post.sellerId, {
                averageRating: stats.averageRating,
                ratingCount: stats.count
            });
        }
    }

    return newReview;
};

exports.getReviews = async (postId, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        ForumReview.find({ postId })
            .populate('userId', 'username fullName avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        ForumReview.countDocuments({ postId })
    ]);

    return { reviews, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

exports.updatePost = async (userId, id, body, files) => {
    const post = await ForumPost.findById(id);
    if (!post) {
        const err = new Error('Không tìm thấy bài đăng');
        err.statusCode = 404;
        throw err;
    }
    if (post.sellerId.toString() !== userId.toString()) {
        const err = new Error('Bạn không có quyền sửa bài này');
        err.statusCode = 403;
        throw err;
    }
    if (post.status === 'approved') {
        const err = new Error('Không thể sửa bài đã được duyệt');
        err.statusCode = 400;
        throw err;
    }

    const { title, description, shortDescription, price, category, tags } = body;
    const updatedData = {
        title,
        description,
        shortDescription,
        price: Number(price),
        category: category || 'Khác',
        status: 'pending' 
    };

    if (tags) {
        try { updatedData.tags = JSON.parse(tags); } catch { updatedData.tags = tags.split(',').map(t => t.trim()); }
    }

    if (files && files.forumSourceFile) {
        deleteFile(post.filePath);
        updatedData.filePath = files.forumSourceFile[0].filename;
    }

    if (files && files.forumThumbnail && files.forumThumbnail.length > 0) {
        deleteFile(post.thumbnail);
        updatedData.thumbnail = '/uploads/forum-thumbnails/' + files.forumThumbnail[0].filename;
    }

    if (files && files.forumDemoImages && files.forumDemoImages.length > 0) {
        if (post.demoImages && post.demoImages.length > 0) {
            post.demoImages.forEach(img => deleteFile(img));
        }
        updatedData.demoImages = files.forumDemoImages.map(file => '/uploads/forum-thumbnails/' + file.filename);
    }

    return ForumPost.findByIdAndUpdate(id, updatedData, { returnDocument: 'after' });
};

exports.deletePost = async (userId, id) => {
    const post = await ForumPost.findById(id);
    if (!post) {
        const err = new Error('Không tìm thấy bài đăng');
        err.statusCode = 404;
        throw err;
    }
    if (post.sellerId.toString() !== userId.toString()) {
        const err = new Error('Bạn không có quyền xóa bài này');
        err.statusCode = 403;
        throw err;
    }
    if (post.purchaseCount > 0) {
        const err = new Error('Không thể xóa bài đã có người mua');
        err.statusCode = 400;
        throw err;
    }

    deleteFile(post.filePath);
    deleteFile(post.thumbnail);
    if (post.demoImages && post.demoImages.length > 0) {
        post.demoImages.forEach(img => deleteFile(img));
    }

    await ForumPost.findByIdAndDelete(id);
};

exports.getPublicPosts = async (query) => {
    const { search, category, sort, page = 1, limit = 12 } = query;
    const filter = { status: 'approved' };

    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
        filter.category = category;
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'popular') {
        sortObj = { views: -1 };
    } else if (sort === 'price_asc') {
        sortObj = { price: 1 };
    } else if (sort === 'price_desc') {
        sortObj = { price: -1 };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        ForumPost.find(filter)
            .select('-filePath')
            .populate('sellerId', 'username fullName avatar averageRating ratingCount')
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit)),
        ForumPost.countDocuments(filter)
    ]);

    return { posts, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

exports.getPostById = async (id, user = null) => {
    const post = await ForumPost.findById(id).select('-filePath').populate('sellerId', 'username fullName avatar averageRating ratingCount');
    if (!post) {
        const err = new Error('Không tìm thấy bài đăng');
        err.statusCode = 404;
        throw err;
    }

    if (post.status !== 'approved') {
        if (!user) {
            const err = new Error('Bài đăng chưa được duyệt');
            err.statusCode = 403;
            throw err;
        }

        const isSeller = post.sellerId._id.toString() === user.userId;
        const isAdmin = user.role === 'admin';

        if (!isSeller && !isAdmin) {
            const err = new Error('Bạn không có quyền xem bài đăng này');
            err.statusCode = 403;
            throw err;
        }
    } else {
        post.views = post.views || 0;
    }

    return post;
};

exports.incrementView = async (id) => {
    await ForumPost.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
};

exports.getMyPosts = async (userId) => {
    return ForumPost.find({ sellerId: userId }).select('-filePath').sort({ createdAt: -1 });
};

exports.checkPurchased = async (userId, postId) => {
    const purchase = await ForumPurchase.findOne({ userId, postId });
    return !!purchase;
};

exports.purchasePost = async (buyerId, postId) => {
    const post = await ForumPost.findById(postId);
    if (!post || post.status !== 'approved') {
        const err = new Error('Sản phẩm không tồn tại hoặc chưa được duyệt');
        err.statusCode = 404;
        throw err;
    }

    if (post.sellerId.toString() === buyerId.toString()) {
        const err = new Error('Bạn không thể tự mua bài đăng của chính mình');
        err.statusCode = 400;
        throw err;
    }

    const alreadyPurchased = await exports.checkPurchased(buyerId, postId);
    if (alreadyPurchased) {
        const err = new Error('Bạn đã mua sản phẩm này rồi');
        err.statusCode = 409;
        throw err;
    }

    const finalPrice = post.price;
    const platformFee = Math.round(finalPrice * 0.05); 
    const sellerEarning = finalPrice - platformFee;

    const updatedBuyer = await User.findOneAndUpdate(
        { _id: buyerId, balance: { $gte: finalPrice } },
        { $inc: { balance: -finalPrice } },
        { returnDocument: 'after' }
    );

    if (!updatedBuyer) {
        const err = new Error('Số dư không đủ để thực hiện giao dịch');
        err.statusCode = 402;
        throw err;
    }

    try {
        await ForumPurchase.create({
            userId: buyerId,
            postId,
            amount: finalPrice
        });

        await User.findByIdAndUpdate(post.sellerId, {
            $inc: { balance: sellerEarning }
        });

        await Promise.all([
            Transaction.create({
                userId: buyerId,
                type: 'FORUM_PURCHASE',
                amount: finalPrice,
                status: 'completed',
                forumPostId: postId,
                description: `Mua mã nguồn forum: ${post.title}`
            }),
            Transaction.create({
                userId: post.sellerId,
                type: 'SELLER_EARNING',
                amount: sellerEarning,
                status: 'completed',
                forumPostId: postId,
                description: `Thu nhập bán mã nguồn forum: ${post.title} (Đã trừ 5% phí)`
            }),
            ForumPost.findByIdAndUpdate(postId, { $inc: { purchaseCount: 1 } }),
            notificationService.createNotification({
                userId: post.sellerId,
                type: 'PURCHASE',
                title: 'Sản phẩm đã được mua',
                message: `Mã nguồn "${post.title}" của bạn vừa được mua. Bạn nhận được +${sellerEarning.toLocaleString('vi-VN')}đ.`
            })
        ]);

        return { filePath: post.filePath };
    } catch (error) {
        console.error('Lỗi sau khi trừ tiền buyer trong forum purchase:', error);
        throw new Error('Lỗi hệ thống khi xử lý thanh toán, vui lòng liên hệ admin.');
    }
};
