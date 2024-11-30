const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true,  // e.g., "SGN" for Tan Son Nhat 
    unique: true 
  },
  name: { 
    type: String, 
    required: true,  // e.g., "Tan Son Nhat International Airport"
  },
  city: { 
    type: String, 
    required: true,  // e.g., "Ho Chi Minh City"
  }
});

// // Create an index on the `code` field (unique index)
// AirportSchema.index({ code: 1 }, { unique: true });

// // Create an index on the `city` field (optional for optimization)
// AirportSchema.index({ city: 1 });


module.exports = mongoose.model("Airport", AirportSchema);
