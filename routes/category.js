const express = require('express');
const router = express.Router();
const categoryRouter = require('../controllers/category');

//get the all categories
router.get(`/`, categoryRouter.getAllCategories);

//getCategory by ID
router.get('/:id',categoryRouter.getCategory);

//add category
router.post(`/`,categoryRouter.addCategory);

//api/v1/64d76d49986cc123b199321f
//delete category
router.delete('/:id',categoryRouter.deleteCategory);

//update category
router.put('/:id',categoryRouter.updateCategory)


module.exports = router;