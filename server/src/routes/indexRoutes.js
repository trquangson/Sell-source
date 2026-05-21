const authRoutes = require('./client/authRoutes');
const adminRoutes = require('./admin/adminRoutes');
const sourceRoutes = require('./client/sourceRoutes');
const couponRoutes = require('./client/couponRoutes');
const paymentRoutes = require('./client/paymentRoutes');
const webhookRoutes = require('./webhookRoutes');
const settingRoutes = require('./client/settingRoutes');
const profileRoutes = require('./client/profileRoutes');
const notificationRoutes = require('./client/notificationRoutes');
const forumRoutes = require('./client/forumRoutes');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/sources', sourceRoutes);
    app.use('/api/coupons', couponRoutes);
    app.use('/api', paymentRoutes);
    app.use('/api', webhookRoutes);
    app.use('/api', settingRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/forum', forumRoutes);
}