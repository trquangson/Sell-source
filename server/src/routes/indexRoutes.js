const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const sourceRoutes = require('./sourceRoutes');
const couponRoutes = require('./couponRoutes');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/sources', sourceRoutes);
    app.use('/api/coupons', couponRoutes);
}