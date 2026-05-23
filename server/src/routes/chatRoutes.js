const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { contentCreationLimiter } = require('../middlewares/rateLimitMiddleware');

router.post('/', contentCreationLimiter, chatController.handleChat);

module.exports = router;
