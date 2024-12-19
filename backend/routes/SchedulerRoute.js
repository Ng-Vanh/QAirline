// schedulerRoutes.js
const express = require('express');
const { startScheduler, stopScheduler, isSchedulerActive } = require('../controllers/SchedulerController'); // Adjust path

const router = express.Router();

// Start the scheduler
router.post('/start', (req, res) => {
  startScheduler();
  res.status(200).send('Scheduler started.');
});

// Stop the scheduler
router.post('/stop', (req, res) => {
  stopScheduler();
  res.status(200).send('Scheduler stopped.');
});

// Get scheduler status
router.get('/status', (req, res) => {
  const status = isSchedulerActive() ? 'running' : 'stopped';
  res.status(200).json({ status });
});

module.exports = router;
