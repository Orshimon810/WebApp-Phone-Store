const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch');

// Define routes
router.route('/').get(branchController.getAllBranches).post(branchController.addBranch);
router.route('/:id').get(branchController.getBranch).delete(branchController.deleteBranch).put(branchController.updateBranch);

module.exports = router;
