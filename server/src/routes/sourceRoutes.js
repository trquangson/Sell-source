const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');

router.get('/', sourceController.getPublicSources);
router.get('/:id', sourceController.getSourceById);

module.exports = router;
