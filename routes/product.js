const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');


//get products by category
//localhost:3000/api/v1/products?categories=2414211551
router.get('/',productController.getByCategory);

//get all the product from DB
router.get(`/`, productController.getAllProducts);

//create one product
router.post(`/`,productController.uploadOptions.single('image'),productController.createdProduct);

//get one product by ID
router.get('/:id',productController.getProduct);
router.get('/stock/:id',productController.getProductStockNumber);

//update Product
router.put('/:id',productController.updateProduct);

//delete Product
router.delete('/:id',productController.deleteProduct);

//get products count
router.get('/get/count',productController.getCount);

//get featured products
router.get('/get/featured',productController.getFeaturedProducts);



module.exports = router;