const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// xác thực bằng Apikey header
router.post('/webhook/sepay', webhookController.sePayWebhook);

module.exports = router;
