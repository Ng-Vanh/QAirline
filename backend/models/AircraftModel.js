const mongoose = require("mongoose");

const AircraftSchema = new mongoose.Schema({
  code: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  seats: { type: Number, required: true },
  type: { type: String, enum: ["Narrow Body", "Wide Body", "Regional Jet"], required: true },
  range: { type: Number, required: true },
  cruiseSpeed: { type: Number, required: true },
  engineType: { type: String, required: true },
  inService: { type: Boolean, required: true },
  lastMaintenance: { type: String, required: true },
  nextMaintenance: { type: String, required: true },
});

module.exports = mongoose.model("Aircraft", AircraftSchema);
