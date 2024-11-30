const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Booking schema
const bookingSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightID: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  flightClass: { type: String, enum: ['economy', 'business'], required: true },
  passengerCount: { type: Number, required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }],
  bookingDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
