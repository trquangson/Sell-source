const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const sourceRoutes = require('./sourceRoutes');
const couponRoutes = require('./couponRoutes');
const paymentRoutes = require('./paymentRoutes');
const webhookRoutes = require('./webhookRoutes');
const settingRoutes = require('./settingRoutes');
const profileRoutes = require('./profileRoutes');
const notificationRoutes = require('./notificationRoutes');
const forumRoutes = require('./forumRoutes');

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