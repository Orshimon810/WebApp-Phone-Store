const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

// Define routes
router.route('/register').post(userController.register);
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.validateUserId,userController.getUser).delete(userController.deleteUser).put(userController.updateUser);
router.route('/login').post(userController.login);
router.route('/get/count').get(userController.getCount);
router.route('/:id/validate-password').post(userController.validatePassword);

module.exports = router;
