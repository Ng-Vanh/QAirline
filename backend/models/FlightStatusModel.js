const mongoose = require("mongoose");

const FlightStatusSchema = new mongoose.Schema({
  status: { type: String, enum: ["Scheduled", "On time", "Delayed", "Cancelled", "Departed", "In-flight", "Landed"], required: true },
  delayDuration: { type: String },  // Example: 20m
  message: { type: String }  // Example: "The flight is experiencing delays due to storms."
});

module.exports = mongoose.model("FlightStatus", FlightStatusSchema);
