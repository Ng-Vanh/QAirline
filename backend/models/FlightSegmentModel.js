// models/FlightSegmentModel.js
const mongoose = require("mongoose");
const Airport = require("./AirportModel");

const FlightSegmentSchema = new mongoose.Schema({
  departureAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  arrivalAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  flightDuration: { type: String, required: true },  // e.g., '2h 30m'
  priceEconomy: { type: Number, required: true },  // Price for economy class
  priceBusiness: { type: Number, required: true },  // Price for business class
  flightClass: { type: String, enum: ["Economy", "Business", "First"], required: true },  // Flight class
});

module.exports = mongoose.model("FlightSegment", FlightSegmentSchema);
