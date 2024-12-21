const Aircraft = require('../models/AircraftModel');

// Controller for creating a new aircraft
exports.createAircraft = async (req, res) => {
  try {
    const { code, manufacturer, model, seats, type, range, cruiseSpeed, engineType, inService, lastMaintenance, nextMaintenance } = req.body;

    if (!code || !manufacturer || !model || !seats || !type || !range || !cruiseSpeed || !engineType || inService === undefined || !lastMaintenance || !nextMaintenance) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAircraft = new Aircraft({
      code,
      manufacturer,
      model,
      seats,
      type,
      range,
      cruiseSpeed,
      engineType,
      inService,
      lastMaintenance,
      nextMaintenance
    });

    await newAircraft.save();

    return res.status(201).json({ message: 'Aircraft created successfully', aircraft: newAircraft });
  } catch (error) {
    console.error('Error creating aircraft:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all aircrafts
exports.getAllAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find();
    return res.status(200).json(aircrafts);
  } catch (error) {
    console.error('Error fetching aircrafts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting an aircraft by its ID
exports.getAircraftById = async (req, res) => {
  try {
    const aircraftId = req.params.id;
    const aircraft = await Aircraft.findById(aircraftId);

    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    return res.status(200).json(aircraft);
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for updating an aircraft by ID
exports.updateAircraft = async (req, res) => {
  try {
    const aircraftId = req.params.id;
    const updates = req.body;

    const updatedAircraft = await Aircraft.findByIdAndUpdate(aircraftId, updates, { new: true });

    if (!updatedAircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    return res.status(200).json({ message: 'Aircraft updated successfully', aircraft: updatedAircraft });
  } catch (error) {
    console.error('Error updating aircraft:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting an aircraft by ID
exports.deleteAircraft = async (req, res) => {
  try {
    const aircraftId = req.params.id;

    const deletedAircraft = await Aircraft.findByIdAndDelete(aircraftId);

    if (!deletedAircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    return res.status(200).json({ message: 'Aircraft deleted successfully' });
  } catch (error) {
    console.error('Error deleting aircraft:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting aircrafts based on type
exports.getAircraftByType = async (req, res) => {
  try {
    const { type } = req.params;
    const aircrafts = await Aircraft.find({ type });

    if (!aircrafts || aircrafts.length === 0) {
      return res.status(404).json({ message: 'No aircrafts found of this type' });
    }

    return res.status(200).json(aircrafts);
  } catch (error) {
    console.error('Error fetching aircraft by type:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};