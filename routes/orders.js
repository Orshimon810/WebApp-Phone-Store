const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');

//get all orders
router.get('/',ordersController.getOrders);

//add order
router.post('/',ordersController.addOrder);

//get one Order by ID
router.get('/:id',ordersController.getOrder);

//update Order
router.put('/:id',ordersController.updateOrder)

//delete Order
router.delete('/:id',ordersController.deleteOrder);

router.get('/get/totalsales',ordersController.totalSales);

//get orders count
router.get('/get/count',ordersController.getOrderCount);

//get orders count for specific user
router.get('/get/userorders/:userid',ordersController.getUserOrders);

module.exports = router;