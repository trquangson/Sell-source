const passwordHelper = require('../../utils/passwordHelper');
const User = require('../../models/User');

const updateProfile = async (userId, data) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    // Chỉ cho phép update fullName
    if (data.fullName) {
        user.fullName = data.fullName;
    }

    await user.save();
    return user;
};

const updatePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    const isMatch = await passwordHelper.comparePassword(oldPassword, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu cũ không chính xác');
    }

    user.password = await passwordHelper.hashPassword(newPassword);

    await user.save();
};

const getPublicProfile = async (userId) => {
    const user = await User.findById(userId).select('username fullName avatar averageRating ratingCount totalSales createdAt');
    if (!user) {
        const err = new Error('Người dùng không tồn tại');
        err.statusCode = 404;
        throw err;
    }

    const ForumPost = require('../../models/ForumPost');
    const posts = await ForumPost.find({ sellerId: userId, status: 'approved' })
        .select('-filePath')
        .sort({ createdAt: -1 });

    let totalSales = 0;
    posts.forEach(p => { totalSales += p.purchaseCount || 0; });

    return {
        user: {
            ...user.toObject(),
            totalSales
        },
        posts
    };
};

module.exports = {
    updateProfile,
    updatePassword,
    getPublicProfile
};
