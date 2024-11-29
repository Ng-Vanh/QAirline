const Passenger = require('../models/PassengerModel');

// Controller for creating a passenger
exports.createPassenger = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const newPassenger = new Passenger({
      name,
      email
    });

    await newPassenger.save();

    return res.status(201).json({ message: 'Passenger created successfully', passenger: newPassenger });
  } catch (error) {
    console.error('Error creating passenger:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting a passenger by ID
exports.getPassengerById = async (req, res) => {
  try {
    const passengerId = req.params.id;
    const passenger = await Passenger.findById(passengerId);

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    return res.status(200).json(passenger);
  } catch (error) {
    console.error('Error fetching passenger:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all passengers
exports.getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find();  // Fetch all passengers from the database

    if (!passengers.length) {
      return res.status(404).json({ message: 'No passengers found' });
    }

    return res.status(200).json(passengers);  // Send the list of passengers as the response
  } catch (error) {
    console.error('Error fetching passengers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

