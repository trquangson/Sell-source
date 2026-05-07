const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/purchases', authenticate, paymentController.purchase);
router.get('/purchases/history', authenticate, paymentController.getHistory);
router.get('/purchases/check/:sourceId', authenticate, paymentController.checkPurchased);
router.get('/purchases/download/:sourceId', authenticate, paymentController.download);

module.exports = router;
