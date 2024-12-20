const Flight = require('../models/FlightModel');
const Airport = require('../models/AirportModel');
const Aircraft = require('../models/AircraftModel');

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


const checkAircraftExist = async (aircraftId) => {
  const aircraft = await Aircraft.findById(aircraftId);
  if (!aircraft) {
    throw new Error('Aircraft does not exist');
  }
};


exports.searchFlights = async (req, res) => {
  try {
    const { departureCity, destinationCity, departureDate, passengerCount } = req.body;

    if (!departureCity || !destinationCity || !departureDate || !passengerCount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const beginDate = new Date(departureDate);
    beginDate.setHours(0, 0, 0, 0);

    const endDate = new Date(departureDate);
    endDate.setHours(23, 59, 59, 999);

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
          // departureTime: { $gte: departureDateObj }, 
          departureTime: {
            $gte: beginDate,
            $lt: endDate
          }
        }
      },
      {
        $project: {
          flightCode: 1,
          flightID: '$_id',
          // departureAirport: '$departureAirportDetails.name',
          // arrivalAirport: '$arrivalAirportDetails.name',
          departureAirportDetails: 1,
          arrivalAirportDetails: 1,
          departureTime: 1,
          flightDuration: 1,
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

const formatFlightDuration = (durationInMinutes) => {
  const hours = Math.floor(durationInMinutes / 60); // Get the number of hours
  const minutes = durationInMinutes % 60; // Get the remaining minutes

  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours}hr`;
  }
  if (minutes > 0) {
    if (hours > 0) {
      formattedDuration += ' ';
    }
    formattedDuration += `${minutes}m`;
  }

  return formattedDuration || '0m';
};

// Controller for creating a flight
exports.createFlight = async (req, res) => {
  try {
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightClass, aircraft, flightStatus, flightCode } = req.body;

    if (!departureAirport || !arrivalAirport || !departureTime || !arrivalTime || !flightClass || !aircraft || !flightStatus || !flightCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await checkAirportsExist(departureAirport, arrivalAirport);

    await checkAircraftExist(aircraft);

    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);

    const flightDurationInMinutes = (arrivalDate - departureDate) / (1000 * 60);

    if (flightDurationInMinutes <= 0) {
      return res.status(400).json({ message: 'Arrival time must be after departure time' });
    }

    const flightDuration = formatFlightDuration(flightDurationInMinutes);


    const newFlight = new Flight({
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      flightDuration,
      flightClass,
      aircraft,
      flightStatus,
      flightCode
    });

    await newFlight.save();

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
    const { departureAirport, arrivalAirport, departureTime, arrivalTime, flightClass, aircraft, flightStatus, flightCode } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (departureAirport && departureAirport !== flight.departureAirport) {
      await checkAirportsExist(departureAirport, arrivalAirport || flight.arrivalAirport);
    }
    if (arrivalAirport && arrivalAirport !== flight.arrivalAirport) {
      await checkAirportsExist(departureAirport || flight.departureAirport, arrivalAirport);
    }
    if (aircraft && aircraft !== flight.aircraft) {
      await checkAircraftExist(aircraft);
    }

    const departureDate = departureTime ? new Date(departureTime) : flight.departureTime;
    const arrivalDate = arrivalTime ? new Date(arrivalTime) : flight.arrivalTime;

    const flightDurationInMinutes = (arrivalDate - departureDate) / (1000 * 60);

    if (flightDurationInMinutes <= 0) {
      return res.status(400).json({ message: 'Arrival time must be after departure time' });
    }

    const flightDuration = formatFlightDuration(flightDurationInMinutes);

    flight.departureAirport = departureAirport || flight.departureAirport;
    flight.arrivalAirport = arrivalAirport || flight.arrivalAirport;

    // flight.departureTime = departureTime || flight.departureTime;
    // flight.arrivalTime = arrivalTime || flight.arrivalTime;

    flight.departureTime = departureDate;
    flight.arrivalTime = arrivalDate;

    flight.flightDuration = flightDuration;
    flight.flightClass = flightClass || flight.flightClass;
    flight.aircraft = aircraft || flight.aircraft;
    flight.flightStatus = flightStatus || flight.flightStatus;
    flight.flightCode = flightCode || flight.flightCode;

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
      .populate('departureAirport arrivalAirport aircraft');

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.status(200).json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting a flight by flightCode
exports.getFlightByCode = async (req, res) => {
  try {
    const flightCode = req.params.code;

    if (!flightCode) {
      return res.status(400).json({ message: 'Flight code is required' });
    }
    
    const sanitizedFlightCode = flightCode.replace(/\s+/g, '').toLowerCase();

    const flight = await Flight.findOne({ flightCode: new RegExp(sanitizedFlightCode, 'i') })
      .populate('departureAirport arrivalAirport aircraft');

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.status(200).json(flight);
  } catch (error) {
    console.error('Error fetching flight by code:', error);
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
