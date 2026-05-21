const express = require('express');
const router = express.Router();
const settingController = require('../../controllers/client/clientSettingController');

router.get('/public/settings', settingController.getPublicSettings);

module.exports = router;
