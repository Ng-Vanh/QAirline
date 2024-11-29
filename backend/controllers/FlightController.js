const Flight = require('../models/FlightModel');
const Airport = require('../models/AirportModel');

// Helper function to check if airports exist
const checkAirportsExist = async (departureAirportId, arrivalAirportId) => {
  const departureAirport = await Airport.findById(departureAirportId);
  const arrivalAirport = await Airport.findById(arrivalAirportId);

  if (!departureAirport) {
    throw new Error('Departure airport does not exist');
  }
  if (!arrivalAirport) {
    throw new Error('Arrival airport does not exist');
  }
};

// Controller to search for flights based on criteria
exports.searchFlights = async (req, res) => {
  try {
    const { departureCity, destinationCity, departureDate, passengerCount } = req.body;

    // Validate input data
    if (!departureCity || !destinationCity || !departureDate || !passengerCount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert departureDate to a Date object
    const departureDateObj = new Date(departureDate);

    // Use aggregation to perform the query with the city matching
    const flights = await Flight.aggregate([
      {
        $lookup: {
          from: 'airports',  // the collection for airports
          localField: 'departureAirport',
          foreignField: '_id',
          as: 'departureAirportDetails'  // alias to hold the departure airport details
        }
      },
      {
        $lookup: {
          from: 'airports',  // the collection for airports
          localField: 'arrivalAirport',
          foreignField: '_id',
          as: 'arrivalAirportDetails'  // alias to hold the arrival airport details
        }
      },
      {
        $unwind: '$departureAirportDetails'  // Flatten the departure airport array
      },
      {
        $unwind: '$arrivalAirportDetails'  // Flatten the arrival airport array
      },
      {
        $match: {
          'departureAirportDetails.city': departureCity,  // Match departure city
          'arrivalAirportDetails.city': destinationCity,  // Match arrival city
          departureTime: { $gte: departureDateObj },  // Match departure date
        }
      },
      {
        $project: {
          flightID: '$_id',
          departureAirport: '$departureAirportDetails.name',
          arrivalAirport: '$arrivalAirportDetails.name',
          departureTime: 1,
          arrivalTime: 1,
          flightClass: 1,
          // Calculate the max available seats between economy and business
          availableSeats: { $max: ['$flightClass.economy.seatsAvailable', '$flightClass.business.seatsAvailable'] }
        }
      },
      {
        $match: {
          availableSeats: { $gte: passengerCount }  // Only return flights with enough available seats
        }
      }
    ]);

    // Send the response back to the client
    return res.status(200).json(flights);
  } catch (error) {
    console.error('Error searching for flights:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for creating a flight
exports.createFlight = async (req, res) => {
  try {
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightDuration, flightClass } = req.body;

    // Validate the data
    if (!departureAirport || !arrivalAirport || !departureTime || !arrivalTime || !flightDuration || !flightClass) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure the airports exist before creating the flight
    await checkAirportsExist(departureAirport, arrivalAirport);

    // Create a new flight document
    const newFlight = new Flight({
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      flightDuration,
      flightClass
    });

    // Save the new flight to the database
    await newFlight.save();

    // Respond with the created flight
    return res.status(201).json({ message: 'Flight created successfully', flight: newFlight });

  } catch (error) {
    console.error('Error creating flight:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Controller for updating a flight by ID
exports.updateFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightDuration, flightClass } = req.body;

    // Find the flight by ID
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // If airports are being updated, ensure they exist
    if (departureAirport && departureAirport !== flight.departureAirport) {
      await checkAirportsExist(departureAirport, arrivalAirport || flight.arrivalAirport);
    }
    if (arrivalAirport && arrivalAirport !== flight.arrivalAirport) {
      await checkAirportsExist(departureAirport || flight.departureAirport, arrivalAirport);
    }

    // Update the flight's fields if provided, else retain existing values
    flight.departureAirport = departureAirport || flight.departureAirport;
    flight.arrivalAirport = arrivalAirport || flight.arrivalAirport;
    flight.departureTime = departureTime || flight.departureTime;
    flight.arrivalTime = arrivalTime || flight.arrivalTime;
    flight.flightDuration = flightDuration || flight.flightDuration;
    flight.flightClass = flightClass || flight.flightClass;

    // Save the updated flight to the database
    await flight.save();

    return res.status(200).json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    console.error('Error updating flight:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Controller for getting a flight by ID
exports.getFlightById = async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await Flight.findById(flightId).populate('departureAirport arrivalAirport');
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.status(200).json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().populate('departureAirport arrivalAirport');
    return res.status(200).json(flights);
  } catch (error) {
    console.error('Error fetching all flights:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting a flight by ID
exports.deleteFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await Flight.findByIdAndDelete(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
