const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema({
  code: { type: String, required: true },  // SGN
  name: { type: String, required: true },  // Tan Son Nhat International Airport
  city: { type: String, required: true },  // Ho Chi Minh City
});

module.exports = mongoose.model("Airport", AirportSchema);
