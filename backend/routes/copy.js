const express = require('express');
const router = express.Router();
const copyController = require('../controllers/copyTrading');

router.post('/start', copyController.startCopying);
router.post('/stop', copyController.stopCopying);
router.get('/performance/:followerId', copyController.getPerformance);

module.exports = router;