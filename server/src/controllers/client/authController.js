const authService = require('../../services/client/authService');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

exports.register = async (req, res) => {
    try {
        await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!'
        });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.message);
        res.status(400).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra từ server.'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const { token, user } = await authService.loginUser(username, password);

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            user
        });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.message);
        res.status(401).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra từ server.'
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công!'
    });
};

exports.getMe = async (req, res) => {
    try {
        // req.user được gán từ authMiddleware
        const user = await authService.getUserById(req.user.userId);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Phiên đăng nhập không hợp lệ.'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email.' });
        }
        await authService.forgotPassword(email);
        res.status(200).json({
            success: true,
            message: 'Email khôi phục mật khẩu đã được gửi!'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra.'
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
        }

        await authService.resetPassword(token, password);
        res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công!'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra.'
        });
    }
};
