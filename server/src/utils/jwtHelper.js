const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_default_123';
const JWT_EXPIRES_IN = '7d';

/**
 * Tạo JWT Token cho user
 * @param {Object} payload Dữ liệu đưa vào token
 * @returns {String} JWT Token
 */
exports.generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Xác thực và giải mã JWT Token
 * @param {String} token Token cần giải mã
 * @returns {Object} Payload đã giải mã
 */
exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
