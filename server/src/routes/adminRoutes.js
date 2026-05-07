const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');
const userController = require('../controllers/userController');
const couponController = require('../controllers/couponController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const { uploadSourceFiles } = require('../middlewares/uploadMiddleware');

router.use(authenticate, isAdmin);

router.get('/sources', sourceController.getAllSourcesForAdmin);
router.post('/sources', uploadSourceFiles, sourceController.createSource);
router.put('/sources/:id', uploadSourceFiles, sourceController.updateSource);
router.delete('/sources/:id', sourceController.deleteSource);

router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);
router.delete('/users/:id', userController.deleteUser);

router.get('/coupons', couponController.getAllCoupons);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

module.exports = router;
