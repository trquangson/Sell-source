const Notification = require('../../models/Notification');
const EventEmitter = require('events');

const notificationEmitter = new EventEmitter();

const createNotification = async ({ userId, type, title, message, metadata = {} }) => {
    const notification = await Notification.create({ userId, type, title, message, metadata, isGlobal: false });
    notificationEmitter.emit('new_notification', notification);
    return notification;
};

/**
 * Lấy danh sách notification cho user:
 * - Noti cá nhân
 * - Noti global (isGlobal: true, chưa bị user này đọc thì isRead = false)
 */
const getUserNotifications = async (userId, page = 1, limit = 8) => {
    const skip = (page - 1) * limit;

    const [personal, global] = await Promise.all([
        Notification.find({ userId, isGlobal: false, deletedBy: { $ne: userId } })
            .sort({ createdAt: -1 })
            .lean(),
        Notification.find({ isGlobal: true, deletedBy: { $ne: userId } })
            .sort({ createdAt: -1 })
            .lean()
    ]);

    const globalWithReadState = global.map(n => ({
        ...n,
        isRead: n.readBy?.some(id => id.toString() === userId.toString()) ?? false
    }));

    const all = [...personal, ...globalWithReadState].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const total = all.length;
    const paginated = all.slice(skip, skip + limit);

    return { notifications: paginated, total, page, totalPages: Math.ceil(total / limit) };
};

const getUnreadCount = async (userId) => {
    const [personalCount, globalCount] = await Promise.all([
        Notification.countDocuments({ userId, isGlobal: false, isRead: false, deletedBy: { $ne: userId } }),
        Notification.countDocuments({
            isGlobal: true,
            readBy: { $ne: userId },
            deletedBy: { $ne: userId }
        })
    ]);
    return personalCount + globalCount;
};

const markAsRead = async (userId, notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) return null;

    if (notification.isGlobal) {
        return Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { readBy: userId } },
            { returnDocument: 'after' }
        );
    }

    // Chỉ được mark read noti của chính mình
    if (notification.userId?.toString() !== userId.toString()) return null;

    return Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { returnDocument: 'after' }
    );
};

const markAllAsRead = async (userId) => {
    const [globalNotis] = await Promise.all([
        Notification.find({ isGlobal: true, readBy: { $ne: userId }, deletedBy: { $ne: userId } }).select('_id').lean()
    ]);

    await Promise.all([
        Notification.updateMany(
            { userId, isGlobal: false, isRead: false, deletedBy: { $ne: userId } },
            { $set: { isRead: true } }
        ),
        ...globalNotis.map(n =>
            Notification.findByIdAndUpdate(n._id, { $addToSet: { readBy: userId } })
        )
    ]);
};

const softDeleteNotification = async (userId, notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) return null;

    if (notification.isGlobal) {
        return Notification.findByIdAndUpdate(
            notificationId,
            { $addToSet: { deletedBy: userId } },
            { returnDocument: 'after' }
        );
    }

    if (notification.userId?.toString() !== userId.toString()) return null;

    return Notification.findByIdAndUpdate(
        notificationId,
        { $addToSet: { deletedBy: userId } },
        { returnDocument: 'after' }
    );
};

module.exports = {
    notificationEmitter,
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    softDeleteNotification
};
