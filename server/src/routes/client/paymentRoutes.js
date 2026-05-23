const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/client/paymentController');
const { authenticate } = require('../../middlewares/authMiddleware');
const { paymentLimiter } = require('../../middlewares/rateLimitMiddleware');

router.post('/purchases', authenticate, paymentLimiter, paymentController.purchase);
router.get('/purchases/history', authenticate, paymentController.getHistory);
router.get('/purchases/check/:sourceId', authenticate, paymentController.checkPurchased);
router.get('/purchases/download/:sourceId', authenticate, paymentController.download);

module.exports = router;
