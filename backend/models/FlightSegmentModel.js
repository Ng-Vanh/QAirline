// models/FlightSegment.js
const mongoose = require("mongoose");

const FlightSegmentSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  aircraft: { type: mongoose.Schema.Types.ObjectId, ref: "Aircraft", required: true },
  departureAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  arrivalAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  flightDuration: { type: String, required: true },
  class: { type: String, enum: ["Economy", "Business", "First"], required: true },
  amenities: [{ type: String }],
  gate: { type: String, required: true },
  terminal: { type: String, required: true },
  baggageAllowance: { type: String },
  carryOnAllowance: { type: String },
  flightStatus: { type: mongoose.Schema.Types.ObjectId, ref: "FlightStatus" }, // Reference to FlightStatus schema
  discounts: [{ type: String }]
});

module.exports = mongoose.model("FlightSegment", FlightSegmentSchema);
