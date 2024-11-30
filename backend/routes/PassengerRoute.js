const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/PassengerController'); 

// Route for creating a new passenger
router.post('/', passengerController.createPassenger);

// Route for getting a passenger by ID
router.get('/:id', passengerController.getPassengerById);

// Route for getting all passengers
router.get('/', passengerController.getAllPassengers);

module.exports = router;
