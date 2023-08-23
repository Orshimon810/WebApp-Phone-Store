const express = require('express');
const router = express.Router();
const categoryRouter = require('../controllers/category');

router.get(`/`, categoryRouter.getAllCategories)
      .post(`/`,categoryRouter.addCategory);

router.get('/:id',categoryRouter.validateCategoryId,categoryRouter.getCategory)
      .delete('/:id',categoryRouter.deleteCategory)
      .put('/:id',categoryRouter.updateCategory)



module.exports = router;