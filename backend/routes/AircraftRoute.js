const express = require('express');
const router = express.Router();
const AircraftController = require('../controllers/AircraftController');

// Route to create a new aircraft
router.post('/', AircraftController.createAircraft);

// Route to get all aircrafts
router.get('/', AircraftController.getAllAircrafts);

// Route to get aircraft by ID
router.get('/:id', AircraftController.getAircraftById);

// Route to update aircraft by ID
router.put('/:id', AircraftController.updateAircraft);

// Route to delete aircraft by ID
router.delete('/:id', AircraftController.deleteAircraft);

// Route to get aircraft by type
router.get('/type/:type', AircraftController.getAircraftByType);

module.exports = router;
