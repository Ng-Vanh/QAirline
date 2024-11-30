const Flight = require('../models/FlightModel');
const Airport = require('../models/AirportModel');
const Aircraft = require('../models/AircraftModel'); // Import Aircraft model

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

// Helper function to check if aircraft exists
const checkAircraftExist = async (aircraftId) => {
  const aircraft = await Aircraft.findById(aircraftId);
  if (!aircraft) {
    throw new Error('Aircraft does not exist');
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
          from: 'airports', 
          localField: 'departureAirport',
          foreignField: '_id',
          as: 'departureAirportDetails'  
        }
      },
      {
        $lookup: {
          from: 'airports',  
          localField: 'arrivalAirport',
          foreignField: '_id',
          as: 'arrivalAirportDetails'
        }
      },
      {
        $lookup: {
          from: 'aircrafts',  
          localField: 'aircraft',
          foreignField: '_id',
          as: 'aircraftDetails'
        }
      },
      {
        $unwind: '$departureAirportDetails'  
      },
      {
        $unwind: '$arrivalAirportDetails' 
      },
      {
        $unwind: '$aircraftDetails'
      },
      {
        $match: {
          'departureAirportDetails.city': departureCity,  
          'arrivalAirportDetails.city': destinationCity,
          departureTime: { $gte: departureDateObj },  
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
          aircraft: '$aircraftDetails.model',
          availableSeats: { 
            $max: ['$flightClass.economy.seatsAvailable', '$flightClass.business.seatsAvailable']
          }
        }
      },
      {
        $match: {
          availableSeats: { $gte: passengerCount } 
        }
      }
    ]);

    return res.status(200).json(flights);
  } catch (error) {
    console.error('Error searching for flights:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for creating a flight
exports.createFlight = async (req, res) => {
  try {
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightDuration, flightClass, aircraft } = req.body;

    // Validate the data
    if (!departureAirport || !arrivalAirport || !departureTime || !arrivalTime || !flightDuration || !flightClass || !aircraft) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure the airports exist before creating the flight
    await checkAirportsExist(departureAirport, arrivalAirport);

    // Ensure the aircraft exists before creating the flight
    await checkAircraftExist(aircraft);

    // Create a new flight document
    const newFlight = new Flight({
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      flightDuration,
      flightClass,
      aircraft
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
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightDuration, flightClass, aircraft } = req.body;

    // Find the flight by ID
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // If airports or aircraft are being updated, ensure they exist
    if (departureAirport && departureAirport !== flight.departureAirport) {
      await checkAirportsExist(departureAirport, arrivalAirport || flight.arrivalAirport);
    }
    if (arrivalAirport && arrivalAirport !== flight.arrivalAirport) {
      await checkAirportsExist(departureAirport || flight.departureAirport, arrivalAirport);
    }
    if (aircraft && aircraft !== flight.aircraft) {
      await checkAircraftExist(aircraft);
    }

    // Update the flight's fields if provided, else retain existing values
    flight.departureAirport = departureAirport || flight.departureAirport;
    flight.arrivalAirport = arrivalAirport || flight.arrivalAirport;
    flight.departureTime = departureTime || flight.departureTime;
    flight.arrivalTime = arrivalTime || flight.arrivalTime;
    flight.flightDuration = flightDuration || flight.flightDuration;
    flight.flightClass = flightClass || flight.flightClass;
    flight.aircraft = aircraft || flight.aircraft;

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
    const flight = await Flight.findById(flightId)
      .populate('departureAirport arrivalAirport aircraft');  // added aircraft

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
    const flights = await Flight.find().populate('departureAirport arrivalAirport aircraft'); 
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
