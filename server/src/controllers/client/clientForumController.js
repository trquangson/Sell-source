const clientForumService = require('../../services/client/clientForumService');
const path = require('path');
const fs = require('fs');

exports.createPost = async (req, res) => {
    try {
        const post = await clientForumService.createPost(req.user.userId, req.body, req.files);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await clientForumService.updatePost(req.user.userId, req.params.id, req.body, req.files);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await clientForumService.deletePost(req.user.userId, req.params.id);
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.getPublicPosts = async (req, res) => {
    try {
        const result = await clientForumService.getPublicPosts(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const review = await clientForumService.addReview(req.params.id, req.user.userId, req.body);
        res.status(201).json({ message: 'Thêm đánh giá thành công', data: review });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const result = await clientForumService.getReviews(req.params.id, req.query);
        res.json({ data: result });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

exports.incrementView = async (req, res) => {
    try {
        await clientForumService.incrementView(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await clientForumService.getPostById(req.params.id, req.user);
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const posts = await clientForumService.getMyPosts(req.user.userId);
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.checkPurchased = async (req, res) => {
    try {
        const purchased = await clientForumService.checkPurchased(req.user.userId, req.params.id);
        res.json({ success: true, purchased });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.purchasePost = async (req, res) => {
    try {
        await clientForumService.purchasePost(req.user.userId, req.params.id);
        res.status(201).json({ success: true, message: 'Mua thành công' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

exports.downloadPost = async (req, res) => {
    try {
        const { id } = req.params;
        const purchased = await clientForumService.checkPurchased(req.user.userId, id);
        if (!purchased) {
            return res.status(403).json({ success: false, message: 'Bạn chưa mua sản phẩm này' });
        }

        const ForumPost = require('../../models/ForumPost');
        const post = await ForumPost.findById(id).select('filePath title');
        if (!post || !post.filePath) {
            return res.status(404).json({ success: false, message: 'File không tồn tại' });
        }

        const absolutePath = path.join(__dirname, '../../../storage/forum-sources', post.filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ success: false, message: 'File không tìm thấy trên server' });
        }

        const ext = path.extname(post.filePath);
        const safeTitle = post.title.replace(/[^a-z0-9]/gi, '_');
        const filename = ext ? `${safeTitle}${ext}` : safeTitle;
        res.download(absolutePath, filename);
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
