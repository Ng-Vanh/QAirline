const mongoose = require("mongoose");

const AircraftSchema = new mongoose.Schema({
  code: { type: String, required: true },  // B787
  manufacturer: { type: String, required: true },  // Boeing
  model: { type: String, required: true },  // 787 Dreamliner
  seats: { type: Number, required: true },  // 330
  type: { type: String, enum: ["Narrow Body", "Wide Body", "Regional Jet"], required: true },
  range: { type: Number, required: true },  // 14140
  cruiseSpeed: { type: Number, required: true },  // 903 km/h
  engineType: { type: String, required: true },  // Turbofan
  inService: { type: Boolean, required: true },  // True or False
  lastMaintenance: { type: String, required: true },  // 2023-05-15
  nextMaintenance: { type: String, required: true },  // 2023-11-15
});

module.exports = mongoose.model("Aircraft", AircraftSchema);
