const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/authController');

const { authenticate } = require('../../middlewares/authMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/google', authController.loginWithGoogle);

router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
