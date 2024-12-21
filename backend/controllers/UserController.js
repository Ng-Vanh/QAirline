const User = require('../models/UserModel');

// Controller for creating a user
exports.createUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username, and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({
      name,
      username,
      password,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting a user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // const user = await User.findById(userId).populate('bookings');
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for getting all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('bookings');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for updating a user by ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, username, password, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for deleting a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Controller for user login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: { userId: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
