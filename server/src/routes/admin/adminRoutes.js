const express = require('express');
const router = express.Router();
const sourceController = require('../../controllers/admin/adminSourceController');
const userController = require('../../controllers/admin/userController');
const couponController = require('../../controllers/admin/adminCouponController');
const dashboardController = require('../../controllers/admin/dashboardController');
const settingController = require('../../controllers/admin/adminSettingController');
const adminNotificationController = require('../../controllers/admin/adminNotificationController');
const forumController = require('../../controllers/admin/adminForumController');
const { authenticate, isAdmin } = require('../../middlewares/authMiddleware');
const { uploadSourceFiles } = require('../../middlewares/uploadMiddleware');

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
