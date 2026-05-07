const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/validate', authenticate, couponController.validateCoupon);

module.exports = router;
