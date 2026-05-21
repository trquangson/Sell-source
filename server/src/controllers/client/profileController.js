const profileService = require('../../services/client/profileService');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { fullName } = req.body;

        const user = await profileService.updateProfile(userId, { fullName });

        res.json({
            success: true,
            message: 'Cập nhật thông tin thành công!',
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                balance: user.balance
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin.' });
        }

        await profileService.updatePassword(userId, oldPassword, newPassword);

        res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getPublicProfile = async (req, res) => {
    try {
        const profile = await profileService.getPublicProfile(req.params.id);
        res.json({ success: true, profile });
    } catch (error) {
        res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
};
