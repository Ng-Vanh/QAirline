const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getPopularFlights
} = require('../controllers/BookingController');

const router = express.Router();

// Route to create a new booking
router.post('/', createBooking);

// Route to get all bookings for a user
router.get('/user/:userID', getUserBookings);

// Route to get booking details by booking ID
router.get('/:id', getBookingById);

// Route to update a booking by ID
router.put('/:id', updateBooking);

// Route to delete a booking by ID
router.delete('/:id', deleteBooking);

// Route to get all bookings
router.get('/', getAllBookings);

// Route to get popular flights
router.get('/rank/popular-flights', getPopularFlights);

module.exports = router;
