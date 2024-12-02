const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true,
  },
  city: { 
    type: String, 
    required: true,
  }
});

// AirportSchema.index({ code: 1 }, { unique: true });

// AirportSchema.index({ city: 1 });


module.exports = mongoose.model("Airport", AirportSchema);
