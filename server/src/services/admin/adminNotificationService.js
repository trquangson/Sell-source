const Notification = require('../../models/Notification');

const createGlobalNotification = async ({ type = 'ADMIN', title, message, metadata = {} }) => {
    return Notification.create({ userId: null, type, title, message, metadata, isGlobal: true });
};

// Admin: lấy danh sách tất cả noti admin đã gửi
const getAdminSentNotifications = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const query = { type: 'ADMIN' };

    const [notifications, total] = await Promise.all([
        Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Notification.countDocuments(query)
    ]);

    return { notifications, total, page, totalPages: Math.ceil(total / limit) };
};

// Admin: xóa hẳn notification
const deleteNotification = async (notificationId) => {
    return Notification.findByIdAndDelete(notificationId);
};

module.exports = {
    createGlobalNotification,
    getAdminSentNotifications,
    deleteNotification
};
