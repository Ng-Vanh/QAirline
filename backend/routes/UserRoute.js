const express = require('express');
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/UserController');

const router = express.Router();

// Route to create a new user
router.post('/', createUser);

// Route to get a user by ID
router.get('/:id', getUserById);

// Route to get all users
router.get('/', getAllUsers);

// Route to update a user by ID
router.put('/:id', updateUser);

// Route to delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;