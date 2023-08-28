const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

//Register a new user
router.post('/register',userController.register);

//Get all users
router.get('/',userController.getAllUsers);

//Get user by ID
router.get('/:id',userController.getUser);

//login a user
router.post('/login',userController.login);

//get users count
router.get('/get/count',userController.getCount);

//delete user
router.delete('/:id',userController.deleteUser);

//update user password
router.put('/:id',userController.updateUser);
 
module.exports = router; 