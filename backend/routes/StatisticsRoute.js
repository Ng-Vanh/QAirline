const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/StatisticsController');

// Endpoint to get statistics
router.get('/', statisticsController.getStatistics);

module.exports = router;
