const rateLimit = require('express-rate-limit');

// Global Limiter (Mọi route /api/)
// Tối đa 400 request / 15 phút
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    message: {
        success: false,
        message: 'Hệ thống bận, vui lòng thử lại sau'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth Limiter (/login, /register, /google)
// Tối đa 5 request / 5 phút
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Thử quá nhiều lần, vui lòng đợi 5 phút'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Forgot Password Limiter (/forgot-password)
// Tối đa 3 request / 1 tiếng
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Yêu cầu khôi phục mật khẩu quá nhiều lần, thử lại sau 1 tiếng'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Payment Limiter (Các route tạo thanh toán)
// Tối đa 5 request / 10 phút
const paymentLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Thao tác thanh toán quá nhanh, vui lòng đợi'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Content Creation Limiter (POST tin nhắn chat, bài viết forum)
// Tối đa 10 request / 1 phút
const contentCreationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Thao tác quá nhanh, vui lòng chậm lại'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    globalLimiter,
    authLimiter,
    forgotPasswordLimiter,
    paymentLimiter,
    contentCreationLimiter
};
