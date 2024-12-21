const express = require('express');
const router = express.Router();
const AirportController = require('../controllers/AirportController');

// Route to create a new airport
router.post('/', AirportController.createAirport);

// Route to get airport by ID
router.get('/:id', AirportController.getAirportById);

// Route to get all airports
router.get('/', AirportController.getAllAirports);

// Route to update airport by ID
router.put('/:id', AirportController.updateAirport);

// Route to delete airport by ID
router.delete('/:id', AirportController.deleteAirport);

module.exports = router;
