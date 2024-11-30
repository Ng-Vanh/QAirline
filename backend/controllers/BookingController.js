const Booking = require('../models/BookingModel');
const Passenger = require('../models/PassengerModel');
const User = require('../models/UserModel');
const Flight = require('../models/FlightModel');
const mongoose = require('mongoose');

// Controller for creating a booking
exports.createBooking = async (req, res) => {
  try {
    const { userID, flightID, flightClass, passengerCount, passengerIDs } = req.body;

    if (!userID || !flightID || !flightClass || !passengerCount || !passengerIDs || passengerIDs.length !== passengerCount) {
      return res.status(400).json({ message: 'Invalid input data or mismatched passenger count' });
    }

    const passengers = await Passenger.find({ '_id': { $in: passengerIDs } });
    if (passengers.length !== passengerCount) {
      return res.status(404).json({ message: 'One or more passengers not found' });
    }

    const flight = await Flight.findById(flightID);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const availableSeats = flight.flightClass[flightClass]?.seatsAvailable;
    if (availableSeats === undefined) {
      return res.status(400).json({ message: 'Invalid flight class selected' });
    }

    if (availableSeats < passengerCount) {
      return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
    }

    const classPrice = flight.flightClass[flightClass]?.price;
    if (classPrice === undefined) {
      return res.status(400).json({ message: `Price not available for class ${flightClass}` });
    }

    const totalPrice = passengerCount * classPrice;

    const newBooking = new Booking({
      userID,
      flightID,
      flightClass,
      passengerCount,
      passengers: passengerIDs,
      bookingDate: new Date(),
      totalPrice 
    });

    await newBooking.save();

    const user = await User.findById(userID);
    user.bookings.push(newBooking._id);
    await user.save();

    flight.flightClass[flightClass].seatsAvailable -= passengerCount;
    await flight.save();

    return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userID = req.params.userID;
    const { type } = req.query; 

    let matchCondition = { userID: new mongoose.Types.ObjectId(userID) };

    if (type) {
      if (type === "Past") {
        matchCondition["flight.flightStatus"] = "Landed";
      } else if (type === "Upcoming") {
        matchCondition["flight.flightStatus"] = { $ne: "Landed" };
      } else {
        return res.status(400).json({ message: 'Invalid status filter. Use "Upcoming" or "Past".' });
      }
    }

    /*xxxxxxxxxxxxxxxxxxxxxxx update status*/
    const userBookings = await Booking.find({ userID: userID });

    if (userBookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    const flightIDs = userBookings.map(booking => booking.flightID);

    const now = new Date();
    await Flight.updateMany(
      {
        _id: { $in: flightIDs },
        arrivalTime: { $lt: now },
        flightStatus: { $ne: "Landed" }
      },
      {
        $set: { flightStatus: "Landed" }
      }
    );

    /*xxxxxxxxxxxxxxxxxxxxxxx*/
    const bookings = await Booking.aggregate([
      {
        $match: matchCondition
      },
      {
        $lookup: {
          from: 'flights', 
          localField: 'flightID',
          foreignField: '_id',
          as: 'flight'
        }
      },
      {
        $unwind: '$flight'
      },
      {
        $lookup: {
          from: 'airports',
          localField: 'flight.departureAirport',
          foreignField: '_id', 
          as: 'departureAirport'
        }
      },
      {
        $unwind: '$departureAirport'
      },
      {
        $lookup: {
          from: 'airports',
          localField: 'flight.arrivalAirport',
          foreignField: '_id',
          as: 'arrivalAirport'
        }
      },
      {
        $unwind: '$arrivalAirport'
      },
      {
        $lookup: {
          from: 'aircrafts',
          localField: 'flight.aircraft',
          foreignField: '_id',
          as: 'aircraft'
        }
      },
      {
        $unwind: '$aircraft'
      },
      {
        $project: {
          userID: 1,
          flightID: 1,
          flightStatus: '$flight.flightStatus',
          departureAirport: 1,
          arrivalAirport: 1,
          departureTime: '$flight.departureTime',
          arrivalTime: '$flight.arrivalTime', 
          flightDuration: '$flight.flightDuration',
          aircraftID: '$aircraft._id',
          aircraftModel: '$aircraft.model'
        }
      }
    ]);

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const flight = await Flight.findById(booking.flightID);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const oldPassengerCount = booking.passengerCount;
    const oldFlightClass = booking.flightClass;

    if (flightClass) booking.flightClass = flightClass;
    if (passengerIDs) {
      const passengers = await Passenger.find({ '_id': { $in: passengerIDs } });
      if (passengers.length !== passengerIDs.length) {
        return res.status(404).json({ message: 'One or more passengers not found' });
      }
      booking.passengers = passengerIDs;
      booking.passengerCount = passengerIDs.length;
    }

    const classPrice = flight.flightClass[booking.flightClass]?.price;
    if (classPrice === undefined) {
      return res.status(400).json({ message: `Price not available for class ${booking.flightClass}` });
    }

    booking.totalPrice = booking.passengerCount * classPrice;

    await booking.save();

    const newPassengerCount = booking.passengerCount;
    const passengerDifference = newPassengerCount - oldPassengerCount;

    if (flightClass !== oldFlightClass) {
      flight.flightClass[oldFlightClass].seatsAvailable += oldPassengerCount;

      const newAvailableSeats = flight.flightClass[flightClass]?.seatsAvailable;
      if (newAvailableSeats === undefined) {
        return res.status(400).json({ message: 'Invalid flight class selected' });
      }
      if (newAvailableSeats < newPassengerCount) {
        return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
      }

      flight.flightClass[flightClass].seatsAvailable -= newPassengerCount;
    } else {
      if (passengerDifference > 0) {
        const availableSeats = flight.flightClass[flightClass].seatsAvailable;
        if (availableSeats < passengerDifference) {
          return res.status(400).json({ message: `Not enough seats available in ${flightClass} class` });
        }
        flight.flightClass[flightClass].seatsAvailable -= passengerDifference;
      } else if (passengerDifference < 0) {
        flight.flightClass[flightClass].seatsAvailable += Math.abs(passengerDifference);
      }
    }

    await flight.save();

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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const flight = await Flight.findById(booking.flightID);
    if (!flight) {
      // return res.status(404).json({ message: 'Flight not found' });
    }
    else {
      flight.flightClass[booking.flightClass].seatsAvailable += booking.passengerCount;
      await flight.save();
    }

    const user = await User.findById(booking.userID);
    if (user) {
      user.bookings.pull(bookingId);
      await user.save();
    }

    await Booking.findByIdAndDelete(bookingId);

    return res.status(200).json({ message: 'Booking deleted successfully' });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all bookings
exports.getAllBookings = async (req, res) => {
  try {
    // const bookings = await Booking.find().populate('passengers flightID');
    const bookings = await Booking.find();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting the most popular flights based on the number of bookings
exports.getPopularFlights = async (req, res) => {
  try {
    const popularFlights = await Booking.aggregate([
      {
        $lookup: {
          from: 'flights',
          localField: 'flightID',
          foreignField: '_id',
          as: 'flightInfo' 
        }
      },
      { 
        $unwind: '$flightInfo'
      },
      {
        $lookup: {
          from: 'airports',
          localField: 'flightInfo.departureAirport',
          foreignField: '_id',
          as: 'departureAirportInfo'
        }
      },
      { 
        $unwind: { path: '$departureAirportInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'airports',
          localField: 'flightInfo.arrivalAirport',
          foreignField: '_id',
          as: 'arrivalAirportInfo'
        }
      },
      { 
        $unwind: { path: '$arrivalAirportInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: {
            departureCity: '$departureAirportInfo.city',
            arrivalCity: '$arrivalAirportInfo.city'
          },
          flightCount: { $sum: 1 }
        }
      },
      {
        $sort: { flightCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          departureCity: '$_id.departureCity',
          arrivalCity: '$_id.arrivalCity',
          flightCount: 1,
          _id: 0
        }
      }
    ]);

    if (popularFlights.length === 0) {
      return res.status(404).json({ message: 'No popular flights found' });
    }

    return res.status(200).json(popularFlights);
  } catch (error) {
    console.error('Error fetching popular flights:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
