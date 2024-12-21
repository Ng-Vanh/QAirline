const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/StatisticsController');

// Route to get statistics
router.get('/', statisticsController.getStatistics);

module.exports = router;
