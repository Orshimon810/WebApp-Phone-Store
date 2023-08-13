const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

//Register a new user
router.post('/',userController.register);

//Get all users
router.get('/',userController.getAllUsers);

//Get user by ID
router.get('/:id',userController.getUser);

//login a user
router.post('/login',userController.login);
 
module.exports = router; 