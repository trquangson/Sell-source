const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/client/clientCouponController');
const { authenticate } = require('../../middlewares/authMiddleware');

router.post('/validate', authenticate, couponController.validateCoupon);

module.exports = router;
