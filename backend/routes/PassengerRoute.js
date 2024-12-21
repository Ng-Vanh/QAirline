const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/PassengerController');

// Route to create a new passenger
router.post('/', passengerController.createPassenger);

// Route to update passenger by ID
router.get('/:id', passengerController.getPassengerById);

// Route to get all passengers
router.get('/', passengerController.getAllPassengers);

module.exports = router;
