const Airport = require('../models/AirportModel');

// Create a new airport
exports.createAirport = async (req, res) => {
  try {
    const { code, name, city } = req.body;

    if (!code || !name || !city) {
      return res.status(400).json({ message: 'Code, name, and city are required fields.' });
    }

    const existingAirport = await Airport.findOne({ code });
    if (existingAirport) {
      return res.status(400).json({ message: `Airport with code ${code} already exists.` });
    }

    // Create new airport
    const newAirport = new Airport({
      code,
      name,
      city
    });

    const savedAirport = await newAirport.save();

    res.status(201).json({
      message: 'Airport created successfully',
      airport: savedAirport
    });
  } catch (error) {
    console.error('Error creating airport:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get an airport by ID
exports.getAirportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const airport = await Airport.findById(id);
    if (!airport) {
      return res.status(404).json({ message: 'Airport not found' });
    }

    res.status(200).json({ airport });
  } catch (error) {
    console.error('Error getting airport by ID:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all airports
exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.status(200).json({ airports });
  } catch (error) {
    console.error('Error getting airports:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an airport
exports.updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, city } = req.body;

    if (!code && !name && !city) {
      return res.status(400).json({ message: 'At least one field (code, name, or city) must be provided to update.' });
    }

    const updatedAirport = await Airport.findByIdAndUpdate(
      id,
      { code, name, city },
      { new: true }
    );

    if (!updatedAirport) {
      return res.status(404).json({ message: 'Airport not found' });
    }

    res.status(200).json({
      message: 'Airport updated successfully',
      airport: updatedAirport
    });
  } catch (error) {
    console.error('Error updating airport:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an airport
exports.deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAirport = await Airport.findByIdAndDelete(id);
    if (!deletedAirport) {
      return res.status(404).json({ message: 'Airport not found' });
    }

    res.status(200).json({
      message: 'Airport deleted successfully',
      airport: deletedAirport
    });
  } catch (error) {
    console.error('Error deleting airport:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
