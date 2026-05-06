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

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Yêu cầu quyền Quản trị viên (Admin)!'
        });
    }
};
