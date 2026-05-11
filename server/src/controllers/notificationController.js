const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await notificationService.getUserNotifications(userId, page, limit);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.userId);
        res.json({ success: true, count });
    } catch (error) {
        console.error('getUnreadCount error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const result = await notificationService.markAsRead(req.user.userId, req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('markAsRead error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.userId);
        res.json({ success: true });
    } catch (error) {
        console.error('markAllAsRead error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.softDelete = async (req, res) => {
    try {
        const result = await notificationService.softDeleteNotification(req.user.userId, req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('softDelete error:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};
