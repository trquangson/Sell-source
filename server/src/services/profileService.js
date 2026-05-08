const passwordHelper = require('../utils/passwordHelper');
const User = require('../models/User');

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

module.exports = {
    updateProfile,
    updatePassword
};
