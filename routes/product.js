const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// Middleware to validate product IDs
router.use('/:id', productController.validateProductId);

// Define routes
router.route('/byCategory').get(productController.getByCategory);
router.route('/byBrand').get(productController.getByBrand);
router.route('/').get(productController.getAllProducts)
                 .post(productController.uploadOptions.single('image'), productController.createdProduct);
router.route('/:id').get(productController.getProduct)
                    .put(productController.updateProduct)
                    .delete(productController.deleteProduct);

router.route('/stock/:id').get(productController.getProductStockNumber);
router.route('/get/count').get(productController.getCount);
router.route('/get/featured').get(productController.getFeaturedProducts);
router.route('/img/:id').get(productController.getProductImage);
router.put('/update-count/:id', productController.updateCountProduct);


module.exports = router;
