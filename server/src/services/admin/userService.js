const User = require('../../models/User');

/**
 * Lấy toàn bộ danh sách người dùng.
 * @returns {Array}
 */
exports.getAllUsers = async () => {
    return User.find().select('-password').sort({ createdAt: -1 });
};

/**
 * Thay đổi quyền (role) của người dùng.
 * @param {string} targetId  - ID người dùng cần đổi quyền
 * @param {string} role      - Quyền mới 
 * @param {string} requesterId - ID người thực hiện hành động (từ JWT)
 * @returns {object} User sau khi cập nhật
 */
exports.updateUserRole = async (targetId, role, requesterId) => {
    if (requesterId === targetId) {
        const err = new Error('Bạn không thể tự thay đổi quyền của chính mình!');
        err.statusCode = 400;
        throw err;
    }

    if (!['user', 'admin'].includes(role)) {
        const err = new Error('Quyền không hợp lệ! Chỉ chấp nhận "user" hoặc "admin".');
        err.statusCode = 400;
        throw err;
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetId,
        { role },
        { returnDocument: 'after' }
    ).select('-password');

    if (!updatedUser) {
        const err = new Error('Không tìm thấy người dùng');
        err.statusCode = 404;
        throw err;
    }

    return updatedUser;
};

/**
 * Xóa tài khoản người dùng.
 * @param {string} targetId   - ID người dùng cần xóa
 * @param {string} requesterId - ID người thực hiện hành động
 */
exports.deleteUser = async (targetId, requesterId) => {
    if (requesterId === targetId) {
        const err = new Error('Bạn không thể tự xóa tài khoản của chính mình!');
        err.statusCode = 400;
        throw err;
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
        const err = new Error('Không tìm thấy người dùng');
        err.statusCode = 404;
        throw err;
    }
};

/**
 * Cập nhật số dư người dùng.
 * @param {string} targetId  - ID người dùng
 * @param {number} balance   - Số dư mới
 * @returns {object} User sau khi cập nhật
 */
exports.updateUserBalance = async (targetId, balance) => {
    if (balance < 0) {
        const err = new Error('Số dư không được âm!');
        err.statusCode = 400;
        throw err;
    }

    const updatedUser = await User.findByIdAndUpdate(
        targetId,
        { balance },
        { returnDocument: 'after' }
    ).select('-password');

    if (!updatedUser) {
        const err = new Error('Không tìm thấy người dùng');
        err.statusCode = 404;
        throw err;
    }

    return updatedUser;
};
