const Booking = require('../models/BookingModel');
const Passenger = require('../models/PassengerModel');
const User = require('../models/UserModel');
const Flight = require('../models/FlightModel');

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
  
      // Find the flight by flightID
      const flight = await Flight.findById(flightID);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      // Check if there are enough available seats in the selected class
      const availableSeats = flight.flightClass[flightClass]?.seatsAvailable;
      if (availableSeats === undefined) {
        return res.status(400).json({ message: 'Invalid flight class selected' });
      }
  
      if (availableSeats < passengerCount) {
        return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
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
  
      // Update the flight's seatsAvailable for the selected class
      flight.flightClass[flightClass].seatsAvailable -= passengerCount;
      await flight.save();
  
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

/// Controller for updating a booking by ID
exports.updateBooking = async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { flightClass, passengerIDs } = req.body;
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Find the current flight and update available seats
      const flight = await Flight.findById(booking.flightID);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      // Store the old passenger count and class
      const oldPassengerCount = booking.passengerCount;
      const oldFlightClass = booking.flightClass;
  
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
  
      // Update the booking in the database
      await booking.save();
  
      // Handle seat availability updates
      const newPassengerCount = booking.passengerCount;
      const passengerDifference = newPassengerCount - oldPassengerCount;
  
      // If the flight class has changed, update the old and new class seats
      if (flightClass !== oldFlightClass) {
        // Return seats from the old class
        flight.flightClass[oldFlightClass].seatsAvailable += oldPassengerCount;
        // Check if there are enough seats in the new class
        const newAvailableSeats = flight.flightClass[flightClass]?.seatsAvailable;
        if (newAvailableSeats === undefined) {
          return res.status(400).json({ message: 'Invalid flight class selected' });
        }
        if (newAvailableSeats < newPassengerCount) {
          return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
        }
        // Deduct seats for the new class
        flight.flightClass[flightClass].seatsAvailable -= newPassengerCount;
      } else {
        // If the class did not change, just update the seats in the same class
        if (passengerDifference > 0) {
          const availableSeats = flight.flightClass[flightClass].seatsAvailable;
          if (availableSeats < passengerDifference) {
            return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
          }
          flight.flightClass[flightClass].seatsAvailable -= passengerDifference;
        } else if (passengerDifference < 0) {
          // If passenger count decreased, add the seats back
          flight.flightClass[flightClass].seatsAvailable += Math.abs(passengerDifference);
        }
      }
  
      // Save the updated flight
      await flight.save();
  
      // Respond with the updated booking
      return res.status(200).json({ message: 'Booking updated successfully', booking });
  
    } catch (error) {
      console.error('Error updating booking:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
// Controller for deleting a booking by ID
// Controller for deleting a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
      const bookingId = req.params.id;
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Find the flight associated with the booking
      const flight = await Flight.findById(booking.flightID);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      // Restore seats in the relevant flight class
      flight.flightClass[booking.flightClass].seatsAvailable += booking.passengerCount;
      await flight.save();
  
      // Remove the booking from the user's bookings array
      const user = await User.findById(booking.userID);
      if (user) {
        user.bookings.pull(bookingId);
        await user.save();
      }
  
      // Delete the booking from the database
      await Booking.findByIdAndDelete(bookingId);
  
      // Respond with a success message
      return res.status(200).json({ message: 'Booking deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting booking:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Controller for getting all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('passengers flightID');
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting the most popular flights based on the number of bookings
exports.getPopularFlights = async (req, res) => {
  try {
    // Aggregate bookings and group by flightID to count occurrences
    const popularFlights = await Booking.aggregate([
      { $group: { _id: "$flightID", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },  // Limit to top 5 popular flights
    ]);

    // Fetch detailed flight information for each popular flight
    const popularFlightDetails = await Flight.find({ '_id': { $in: popularFlights.map(flight => flight._id) } });

    if (!popularFlightDetails || popularFlightDetails.length === 0) {
      return res.status(404).json({ message: 'No popular flights found' });
    }

    return res.status(200).json({ popularFlights: popularFlights, flightDetails: popularFlightDetails });
  } catch (error) {
    console.error('Error fetching popular flights:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
