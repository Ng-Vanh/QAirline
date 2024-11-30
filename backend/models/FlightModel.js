const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Import Airport model for reference

const FlightSchema = new Schema({
  departureAirport: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
  arrivalAirport: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  flightDuration: { type: Number, required: true },

  // Flight classes with price and available seats
  flightClass: {
    economy: {
      price: { type: Number, required: true },  // Price for economy class
      seatsAvailable: { type: Number, required: true }  // Available seats for economy class
    },
    business: {
      price: { type: Number, required: true },  // Price for business class
      seatsAvailable: { type: Number, required: true }  // Available seats for business class
    }
  },

  aircraft: { type: Schema.Types.ObjectId, ref: 'Aircraft', required: true }  // Aircraft reference
});

module.exports = mongoose.model('Flight', FlightSchema);
