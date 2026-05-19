const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');
const userController = require('../controllers/userController');
const couponController = require('../controllers/couponController');
const dashboardController = require('../controllers/dashboardController');
const settingController = require('../controllers/settingController');
const adminNotificationController = require('../controllers/adminNotificationController');
const forumController = require('../controllers/forumController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const { uploadSourceFiles } = require('../middlewares/uploadMiddleware');

router.use(authenticate, isAdmin);

router.get('/dashboard', dashboardController.getDashboardStats);

router.get('/settings', settingController.getSettings);
router.put('/settings', settingController.updateSettings);

router.get('/sources', sourceController.getAllSourcesForAdmin);
router.post('/sources', uploadSourceFiles, sourceController.createSource);
router.put('/sources/:id', uploadSourceFiles, sourceController.updateSource);
router.delete('/sources/:id', sourceController.deleteSource);

router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);
router.put('/users/:id/balance', userController.updateUserBalance);
router.delete('/users/:id', userController.deleteUser);

router.get('/coupons', couponController.getAllCoupons);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

router.post('/notifications', adminNotificationController.sendNotification);
router.get('/notifications', adminNotificationController.listSentNotifications);
router.delete('/notifications/:id', adminNotificationController.deleteNotification);

router.get('/forum/posts', forumController.getAllPostsForAdmin);
router.patch('/forum/posts/:id/status', forumController.updatePostStatus);

module.exports = router;
