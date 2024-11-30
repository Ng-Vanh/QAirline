const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');  // Import the controller

// Route for creating a new passenger
router.post('/', passengerController.createPassenger);

// Route for getting a passenger by ID
router.get('/:id', passengerController.getPassengerById);

// Route for getting all passengers
router.get('/', passengerController.getAllPassengers);  // Add this route

module.exports = router;
