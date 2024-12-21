const express = require('express');
const FlightController = require('../controllers/FlightController');
const router = express.Router();

// Route to search for flights
router.post('/search', FlightController.searchFlights);

// Route to create a new flight
router.post('/', FlightController.createFlight);

// Route to update flight by ID
router.put('/:id', FlightController.updateFlight);

// Route to get flight by ID
router.get('/:id', FlightController.getFlightById);

// Route to get all flights
router.get('/', FlightController.getAllFlights);

// Route to delete flight by ID
router.delete('/:id', FlightController.deleteFlight);

// Route to get flight by code
router.get('/code/:code', FlightController.getFlightByCode);

module.exports = router;
