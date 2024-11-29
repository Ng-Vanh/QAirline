const FlightService = require('../services/FlightService');

// CREATE: Create a new flight
module.exports.createFlight = async (req, res) => {
  try {
    const { flightType, stopover, flightSegments } = req.body;
    // Call the service to create the flight
    const flight = await FlightService.createFlight(flightType, stopover, flightSegments);
    res.status(201).json(flight);  // Respond with the created flight
  } catch (err) {
    console.error('Error creating flight:', err);
    res.status(500).json({ error: 'Failed to create flight' });
  }
};

// READ: Get a flight by ID
module.exports.getFlightById = async (req, res) => {
  try {
    const flightId = req.params.flightId;
    // Call the service to get flight by ID
    const flight = await FlightService.getFlightById(flightId);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json(flight);  // Respond with the found flight
  } catch (err) {
    console.error('Error fetching flight:', err);
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
};

// UPDATE: Update a flight by ID
module.exports.updateFlight = async (req, res) => {
  try {
    const flightId = req.params.flightId;
    const { flightType, stopover, flightSegments } = req.body;
    // Call the service to update the flight
    const updatedFlight = await FlightService.updateFlight(flightId, flightType, stopover, flightSegments);
    if (!updatedFlight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json(updatedFlight);  // Respond with the updated flight
  } catch (err) {
    console.error('Error updating flight:', err);
    res.status(500).json({ error: 'Failed to update flight' });
  }
};

// DELETE: Delete a flight by ID
module.exports.deleteFlight = async (req, res) => {
  try {
    const flightId = req.params.flightId;
    // Call the service to delete the flight
    const result = await FlightService.deleteFlight(flightId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json({ message: 'Flight deleted successfully' });  // Respond with success message
  } catch (err) {
    console.error('Error deleting flight:', err);
    res.status(500).json({ error: 'Failed to delete flight' });
  }
};

module.exports.getAllFlights = async (req, res) => {
  try {
    // Call the service to get all flights
    const flights = await FlightService.getAllFlights();
    res.status(200).json(flights);  // Respond with the list of flights
  } catch (err) {
    console.error('Error fetching all flights:', err);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};