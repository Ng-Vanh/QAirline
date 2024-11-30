const express = require('express');
const router = express.Router();
const AirportController = require('../controllers/AirportController');

// POST /api/airports: Create an airport
router.post('/', AirportController.createAirport);

// GET /api/airports/:id: Get an airport by ID
router.get('/:id', AirportController.getAirportById);

// GET /api/airports: Get all airports
router.get('/', AirportController.getAllAirports);

// PUT /api/airports/:id: Update an airport
router.put('/:id', AirportController.updateAirport);

// DELETE /api/airports/:id: Delete an airport
router.delete('/:id', AirportController.deleteAirport);

module.exports = router;
