const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.put('/', profileController.updateProfile);

router.put('/password', profileController.updatePassword);

module.exports = router;
