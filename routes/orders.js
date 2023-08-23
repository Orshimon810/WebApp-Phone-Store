const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');


// Define routes
router.route('/').get(ordersController.getOrders).post(ordersController.addOrder);
router.route('/:id').get(ordersController.validateOrderId,ordersController.getOrder).put(ordersController.updateOrder)
.delete(ordersController.deleteOrder);
router.route('/get/totalsales').get(ordersController.totalSales);
router.route('/get/count').get(ordersController.getOrderCount);
router.route('/get/userorders/:userid').get(ordersController.getUserOrders);

module.exports = router;
