// models/Flight.js
const mongoose = require("mongoose");
const FlightSegment = require("./FlightSegmentModel");

const FlightSchema = new mongoose.Schema({
  flightType: { 
    type: String, 
    enum: ["One-way", "Round-trip", "Multi-leg"], 
    required: true 
  },
  stopover: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Airport",  // You can reference an Airport document if it's a stopover airport
    default: null 
  },
  flightSegments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FlightSegment", 
    required: true 
  }],
  flightSummary: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "FlightSegment",  // A reference to a FlightSegment that aggregates the whole flight
    required: true
  }
});

// Method to summarize the flight from the segments
FlightSchema.methods.calculateSummary = async function () {
  const flight = this;

  // Initialize summary values
  let totalPrice = 0;
  let totalDuration = 0;
  let departureAirport = null;
  let arrivalAirport = null;
  let flightStatus = null;

  // Aggregate data from the flight segments
  const flightSegments = await FlightSegment.find({ '_id': { $in: flight.flightSegments } });

  flightSegments.forEach((segment, index) => {
    totalPrice += segment.price;
    totalDuration += parseDuration(segment.flightDuration);

    // Set departure airport (from the first segment)
    if (index === 0) {
      departureAirport = segment.departureAirport;
    }

    // Set arrival airport (from the last segment)
    if (index === flightSegments.length - 1) {
      arrivalAirport = segment.arrivalAirport;
      flightStatus = segment.flightStatus;
    }
  });

  // Create a new summary FlightSegment to represent the entire journey
  const summarySegment = new FlightSegment({
    flightNumber: "Summary", // Placeholder value, can be calculated/assigned
    aircraft: flightSegments[0].aircraft, // Placeholder: take aircraft from the first segment
    departureAirport,
    arrivalAirport,
    departureTime: flightSegments[0].departureTime,
    arrivalTime: flightSegments[flightSegments.length - 1].arrivalTime,
    price: totalPrice,
    availableSeats: flightSegments.reduce((sum, seg) => sum + seg.availableSeats, 0),
    flightDuration: formatDuration(totalDuration),
    class: flightSegments[0].class,  // You could refine this depending on flight type
    amenities: Array.from(new Set(flightSegments.flatMap(seg => seg.amenities))),
    gate: flightSegments[0].gate,  // First segment's gate
    terminal: flightSegments[0].terminal,  // First segment's terminal
    baggageAllowance: flightSegments[0].baggageAllowance,
    carryOnAllowance: flightSegments[0].carryOnAllowance,
    flightStatus,
  });

  // Save summary segment and set flightSummary reference
  await summarySegment.save();
  flight.flightSummary = summarySegment._id;

  return flight;
};

// Helper functions for formatting duration
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function parseDuration(durationStr) {
  const match = durationStr.match(/(\d+)h (\d+)m/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
}

module.exports = mongoose.model("Flight", FlightSchema);
