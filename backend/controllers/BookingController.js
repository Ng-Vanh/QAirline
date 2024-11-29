const Booking = require('../models/BookingModel');
const Passenger = require('../models/PassengerModel');
const User = require('../models/UserModel');
const Flight = require('../models/FlightModel');  // Assuming you need the Flight model to get flight info

// Controller for creating a booking
exports.createBooking = async (req, res) => {
  try {
    const { userID, flightID, flightClass, passengerCount, passengerIDs } = req.body;

    // Validate the input data
    if (!userID || !flightID || !flightClass || !passengerCount || !passengerIDs || passengerIDs.length !== passengerCount) {
      return res.status(400).json({ message: 'Invalid input data or mismatched passenger count' });
    }

    // Check if all passengers exist
    const passengers = await Passenger.find({ '_id': { $in: passengerIDs } });
    if (passengers.length !== passengerCount) {
      return res.status(404).json({ message: 'One or more passengers not found' });
    }

    // Create a new booking
    const newBooking = new Booking({
      userID,
      flightID,
      flightClass,
      passengerCount,
      passengers: passengerIDs,
      bookingDate: new Date()
    });

    // Save the booking to the database
    await newBooking.save();

    // Add the booking to the user's bookings array
    const user = await User.findById(userID);
    user.bookings.push(newBooking._id);
    await user.save();

    // Respond with the created booking
    return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all bookings by userID
exports.getUserBookings = async (req, res) => {
  try {
    const userID = req.params.userID;
    const bookings = await Booking.find({ userID }).populate('passengers flightID');
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting a booking by booking ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId).populate('passengers flightID');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for updating a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { flightClass, passengerIDs } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the flightClass and passengers if provided
    if (flightClass) booking.flightClass = flightClass;
    if (passengerIDs) {
      const passengers = await Passenger.find({ '_id': { $in: passengerIDs } });
      if (passengers.length !== passengerIDs.length) {
        return res.status(404).json({ message: 'One or more passengers not found' });
      }
      booking.passengers = passengerIDs;
      booking.passengerCount = passengerIDs.length;
    }

    // Save the updated booking
    await booking.save();

    // Respond with the updated booking
    return res.status(200).json({ message: 'Booking updated successfully', booking });

  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Remove the booking from the user's bookings array
    const user = await User.findById(booking.userID);
    user.bookings.pull(bookingId);
    await user.save();

    // Delete the booking from the database
    await booking.remove();

    // Respond with a success message
    return res.status(200).json({ message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
