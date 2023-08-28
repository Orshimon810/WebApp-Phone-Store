const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

// Middleware to validate user IDs
router.use('/:id', userController.validateUserId);

// Define routes
router.route('/register').post(userController.register);
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).put(userController.updateUser);
router.route('/login').post(userController.login);
router.route('/get/count').get(userController.getCount);

module.exports = router;
