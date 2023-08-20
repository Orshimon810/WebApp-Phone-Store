const express = require('express');
const router = express.Router();
const branchRouter = require('../controllers/branch');

//get the all branches
router.get(`/`, branchRouter.getAllBranches);

//getBranch by ID
router.get('/:id',branchRouter.getBranch);

//add branch
router.post(`/`,branchRouter.addBranch);

//api/v1/64d76d49986cc123b199321f
//delete branch
router.delete('/:id',branchRouter.deleteBranch);

//update branch
router.put('/:id',branchRouter.updateBranch)

// get branch's coordnates?

module.exports = router;