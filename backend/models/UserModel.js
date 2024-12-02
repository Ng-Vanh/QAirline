const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User schema
const userSchema = new Schema({ // username, password
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },

  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
