const express = require('express');
const router = express.Router();
const userAnalysisController = require('../controllers/userAnalysis');

router.get('/:userId', userAnalysisController.getUserProfile);

module.exports = router;