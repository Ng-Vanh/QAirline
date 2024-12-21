const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Route to login a user
router.post('/login', userController.loginUser);

// Route to create a new user
router.post('/', userController.createUser);

// Route to get user by ID
router.get('/:id', userController.getUserById);

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to update user by ID
router.put('/:id', userController.updateUser);

// Route to get user by username
// router.put('/username/:username', userController.updateUserByUsername);

router.delete('/:id', userController.deleteUser);

module.exports = router;
