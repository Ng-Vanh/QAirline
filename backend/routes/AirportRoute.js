const express = require('express');
const router = express.Router();
const airportController = require('../controllers/AirportController');

// POST /api/airport: Create an airport
router.post('/', airportController.createAirport);

// GET /api/airport/:id: Get an airport by ID
router.get('/:id', airportController.getAirportById);

// GET /api/airport: Get all airports
router.get('/', airportController.getAllAirports);

// PUT /api/airport/:id: Update an airport
router.put('/:id', airportController.updateAirport);

// DELETE /api/airport/:id: Delete an airport
router.delete('/:id', airportController.deleteAirport);

module.exports = router;
