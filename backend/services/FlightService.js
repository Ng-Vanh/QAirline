const Flight = require('../models/FlightModel');
const FlightSegment = require('../models/FlightSegmentModel');

// CREATE: Create a new flight
module.exports.createFlight = async (flightType, stopover, flightSegments) => {
  try {
    // Create the flight segments first
    const segments = await FlightSegment.insertMany(flightSegments);
    
    // Now create the flight with the flightSegments' references
    const flight = new Flight({
      flightType,
      stopover,
      flightSegments: segments.map(segment => segment._id),  // Save references to the segments
    });

    // Optionally calculate flight summary (like cost, airports, etc.)
    await flight.calculateSummary();

    // Save the flight to the database
    await flight.save();
    return flight;  // Return the created flight
  } catch (err) {
    console.error('Error creating flight:', err);
    throw new Error('Failed to create flight');
  }
};

// READ: Get a flight by ID
module.exports.getFlightById = async (flightId) => {
  try {
    // Find the flight by ID and populate the flight segments
    const flight = await Flight.findById(flightId)
      .populate('flightSegments')  // Populate flight segments
      .populate('flightSummary')   // Populate flight summary if needed
      .populate('stopover');       // Populate stopover if available
    return flight;  // Return the found flight
  } catch (err) {
    console.error('Error fetching flight:', err);
    throw new Error('Failed to fetch flight');
  }
};

// UPDATE: Update a flight by ID
module.exports.updateFlight = async (flightId, flightType, stopover, flightSegments) => {
  try {
    // First, update the flight segments
    const segments = await FlightSegment.insertMany(flightSegments);

    // Update the flight document
    const flight = await Flight.findByIdAndUpdate(
      flightId,
      {
        flightType,
        stopover,
        flightSegments: segments.map(segment => segment._id),
      },
      { new: true }  // Return the updated flight document
    )
      .populate('flightSegments')  // Populate updated flight segments
      .populate('flightSummary')   // Populate the summary
      .populate('stopover');       // Populate stopover if available

    if (!flight) {
      throw new Error('Flight not found');
    }

    // Recalculate summary (like cost, airports, etc.)
    await flight.calculateSummary();
    await flight.save();

    return flight;  // Return the updated flight
  } catch (err) {
    console.error('Error updating flight:', err);
    throw new Error('Failed to update flight');
  }
};

// DELETE: Delete a flight by ID
module.exports.deleteFlight = async (flightId) => {
  try {
    // Find and delete the flight by ID
    const result = await Flight.deleteOne({ _id: flightId });
    return result;  // Return the result of the deletion
  } catch (err) {
    console.error('Error deleting flight:', err);
    throw new Error('Failed to delete flight');
  }
};

module.exports.getAllFlights = async () => {
  try {
    // Fetch all flights, and optionally populate any related fields (e.g. flight segments, stopovers)
    const flights = await Flight.find()
      .populate('flightSegments')  // Populate flight segments if needed
      .populate('flightSummary')   // Populate flight summary if needed
      .populate('stopover');       // Populate stopovers if available
    return flights;  // Return the array of all flights
  } catch (err) {
    console.error('Error fetching all flights:', err);
    throw new Error('Failed to fetch all flights');
  }
};