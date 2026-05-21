const notificationService = require('../../services/admin/adminNotificationService');
const User = require('../../models/User');

exports.sendNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;

        if (!title?.trim() || !message?.trim()) {
            return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung không được để trống' });
        }

        if (userId) {
            const user = await User.findById(userId).select('_id');
            if (!user) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }
            await notificationService.createNotification({
                userId,
                type: 'ADMIN',
                title: title.trim(),
                message: message.trim()
            });
            return res.json({ success: true, message: 'Đã gửi thông báo cho người dùng' });
        }

        await notificationService.createGlobalNotification({
            title: title.trim(),
            message: message.trim()
        });
        res.json({ success: true, message: 'Đã broadcast thông báo tới tất cả người dùng' });
    } catch (error) {
        console.error('sendNotification error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.listSentNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await notificationService.getAdminSentNotifications(page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('listSentNotifications error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const deleted = await notificationService.deleteNotification(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
        }
        res.json({ success: true, message: 'Đã xóa thông báo' });
    } catch (error) {
        console.error('deleteNotification error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};
