const bcrypt = require('bcrypt');

/**
 * Mã hoá mật khẩu
 * @param {String} password Mật khẩu gốc
 * @returns {Promise<String>} Mật khẩu đã mã hoá
 */
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * So sánh mật khẩu gốc và mật khẩu mã hoá
 * @param {String} password Mật khẩu gốc
 * @param {String} hashedPassword Mật khẩu đã mã hoá
 * @returns {Promise<Boolean>}
 */
exports.comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
