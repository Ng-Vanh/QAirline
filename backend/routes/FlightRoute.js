const express = require('express');
const router = express.Router();
const FlightController = require('../controllers/FlightController');

// POST: Create a new flight
router.post('/create', FlightController.createFlight);

// GET: Get all flights
router.get('/', FlightController.getAllFlights);  // Add this route to get all flights

// GET: Get a flight by ID
router.get('/:flightId', FlightController.getFlightById);

// PUT: Update flight by ID
router.put('/:flightId', FlightController.updateFlight);

// DELETE: Delete flight by ID
router.delete('/:flightId', FlightController.deleteFlight);

module.exports = router;
