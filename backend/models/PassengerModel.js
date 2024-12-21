const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Passenger', passengerSchema);
