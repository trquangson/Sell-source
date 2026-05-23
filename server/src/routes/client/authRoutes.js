const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/authController');

const { authenticate } = require('../../middlewares/authMiddleware');
const { authLimiter, forgotPasswordLimiter } = require('../../middlewares/rateLimitMiddleware');

router.post('/register', authLimiter, authController.register);

router.post('/login', authLimiter, authController.login);

router.post('/google', authLimiter, authController.loginWithGoogle);

router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);

router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
