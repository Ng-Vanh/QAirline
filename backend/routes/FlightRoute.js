// routes/FlightRoute.js
const express = require('express');
const FlightController = require('../controllers/FlightController'); // Import the flight controller
const router = express.Router();


// POST route for searching flights based on criteria
router.post('/search', FlightController.searchFlights);

router.post('/', FlightController.createFlight);

// PUT route for updating a flight by ID
router.put('/:id', FlightController.updateFlight);

// GET route for getting a flight by ID
router.get('/:id', FlightController.getFlightById);

// GET route for getting all flights
router.get('/', FlightController.getAllFlights);

// DELETE route for deleting a flight by ID
router.delete('/:id', FlightController.deleteFlight);

// GET route for getting a flight by flight code
router.get('/code/:code', FlightController.getFlightByCode);

// Export the router to be used in the main app
module.exports = router;
