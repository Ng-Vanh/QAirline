const express = require('express');
const router = express.Router();
const AircraftController = require('../controllers/AircraftController');

// Route for creating a new aircraft
router.post('/', AircraftController.createAircraft);

// Route for getting all aircrafts
router.get('/', AircraftController.getAllAircrafts);

// Route for getting an aircraft by its ID
router.get('/:id', AircraftController.getAircraftById);

// Route for updating an aircraft by its ID (partial update)
router.put('/:id', AircraftController.updateAircraft);

// Route for deleting an aircraft by its ID
router.delete('/:id', AircraftController.deleteAircraft);

// Route for getting aircrafts by type (e.g., Wide Body, Narrow Body, Regional Jet)
router.get('/type/:type', AircraftController.getAircraftByType);

module.exports = router;
