const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Route for user login
router.post('/login', userController.loginUser);

// Route for creating a new user
router.post('/', userController.createUser);

// Route for getting a user by ID
router.get('/:id', userController.getUserById);

// Route for getting all users
router.get('/', userController.getAllUsers);

// Route for updating a user by ID
router.put('/:id', userController.updateUser);

// // // Route for updating a user by username
// router.put('/username/:username', userController.updateUserByUsername);

// Route for deleting a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
