const notificationService = require('../../services/client/clientNotificationService');

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

exports.streamNotifications = (req, res) => {
    // Cấu hình headers cho Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Gửi một sự kiện khởi tạo ngay lập tức để mở kết nối
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const userId = req.user.userId;

    // Lắng nghe sự kiện new_notification
    const handleNewNotification = (notification) => {
        // Chỉ gửi nếu notification là global hoặc thuộc về user hiện tại
        if (notification.isGlobal || notification.userId?.toString() === userId.toString()) {
            res.write(`data: ${JSON.stringify({ type: 'new_notification', payload: notification })}\n\n`);
        }
    };

    const { notificationEmitter } = require('../../services/client/clientNotificationService');
    notificationEmitter.on('new_notification', handleNewNotification);

    // Dọn dẹp listener khi client ngắt kết nối
    req.on('close', () => {
        notificationEmitter.removeListener('new_notification', handleNewNotification);
    });
};
