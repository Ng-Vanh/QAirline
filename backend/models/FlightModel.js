const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
  departureAirport: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
  arrivalAirport: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  flightDuration: { type: Number, required: true },

  flightClass: {
    economy: {
      price: { type: Number, required: true },  
      seatsAvailable: { type: Number, required: true }  
    },
    business: {
      price: { type: Number, required: true },  
      seatsAvailable: { type: Number, required: true }  
    }
  },

  aircraft: { type: Schema.Types.ObjectId, ref: 'Aircraft', required: true },

  flightStatus: {
    type: String,
    enum: ['Scheduled', 'On time', 'Delayed', 'Landed'],
    required: true,
    default: 'Scheduled' 
  }

});

module.exports = mongoose.model('Flight', FlightSchema);
