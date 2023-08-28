const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const mongoose = require('mongoose');

async function getOrders(req,res){
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1});

    if(!orderList){
        res.status(500).json({success:false});
    }
    res.send(orderList);
}

async function getOrder(req,res){
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
        path: 'orderItems',
        populate: {
            path: 'product',
            model: 'Product',
            populate: {
                path: 'category',
                model: 'Category'
            }
        }
    });
    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
}

function validateOrderId(req, res, next) {
    const order = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(order)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }
  
    next();
  }

  // Function to add a new order
async function addOrder(req, res) {
    // Create an array of promises to save each order item
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    // Resolve the promises to get the order item IDs
    const orderItemsIdsResolved =  await orderItemsIds;

    console.log(orderItemsIdsResolved);

    // Calculate total prices for each order item
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    // Calculate the total price for the order
    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);

    console.log(totalPrice);

     // Create a new order using the calculated data
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    // Save the new order
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

     // Send the newly created order as a response
    res.send(order);
}

// Function to update the status of an order
async function updateOrder (req,res){
     // Update the order's status using findByIdAndUpdate
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status,
        },
        {new:true}
    )

    if(!order){
        return res.status(400).send('the order cannot be Updated');
    }
    
     // Send the updated order as a response
    res.send(order);
}

async function deleteOrder(req, res) {
    Order.findByIdAndDelete(req.params.id).then(async order =>{
        if(order){
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'order has been deleted' });
        } else{
            return res.status(404).json({ success: false, message: 'order not found' });
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
}

// Function to calculate and retrieve the total sales across all orders
async function totalSales(req, res) {
    try {
        // Use the aggregate framework to calculate total sales
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalsales: { $sum: '$totalPrice' } // Assuming 'totalPrice' is the field in your Order schema
                }
            }
        ]);

        console.log(totalSales);

        if (!totalSales || totalSales.length === 0) {
            return res.status(400).send('The order totalSales cannot be generated');
        }

        // Send the calculated total sales as a response
        res.send({ totalSales: totalSales[0].totalsales });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while calculating total sales');
    }
}


async function getOrderCount (req,res){
    const orderCount = await Order.countDocuments({});

    if(!orderCount)
        res.status(500).json({success:false,message:'Problem with Order count'});

    res.send({orderCount:orderCount});
}

// Function to fetch orders for a specific user
async function getUserOrders(req,res){
    // Find orders associated with the specified user ID
    const UserOrderList = await Order.find({user:req.params.userid}).populate({
        path: 'orderItems',
        populate: {
            path: 'product',
            model: 'Product',
            populate: {
                path: 'category',
                model: 'Category',
            }
        }
    }).sort({'dateOrdered':-1});

    if(!UserOrderList){
        res.status(500).json({success:false});
    }

    // Send the list of user orders as a response
    res.send(UserOrderList);
}

module.exports = {
getOrders,
validateOrderId,
addOrder,
getOrder,
updateOrder,
deleteOrder,
totalSales,
getOrderCount,
getUserOrders,
}