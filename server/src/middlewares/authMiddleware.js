const jwtHelper = require('../utils/jwtHelper');

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy phiên làm việc, vui lòng đăng nhập!'
        });
    }

    try {
        const decoded = jwtHelper.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!'
        });
    }
};

exports.authenticateOptional = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            req.user = jwtHelper.verifyToken(token);
        } catch (e) {
            // ignore
        }
    }
    next();
};

const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(403).json({ success: false, message: 'Yêu cầu quyền Quản trị viên (Admin)!' });
        }
        const user = await User.findById(req.user.userId);

        if (user && user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Yêu cầu quyền Quản trị viên (Admin)!'
            });
        }
    } catch (error) {
        console.error('Lỗi check admin:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};
