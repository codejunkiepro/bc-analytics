const express = require('express');
const router = express.Router();
const userAnalysisController = require('../controllers/userAnalysis');

router.get('/top-users', userAnalysisController.getTopUsers);

module.exports = router;