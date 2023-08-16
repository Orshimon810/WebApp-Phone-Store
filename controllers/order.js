const Order = require('../models/order');
const OrderItem = require('../models/order-item');

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

async function addOrder(req, res) {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved =  await orderItemsIds;

    console.log(orderItemsIdsResolved);

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))


    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);

    console.log(totalPrice);

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
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order);
}

async function updateOrder (req,res){
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

async function totalSales(req, res) {
    try {
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

async function getUserOrders(req,res){
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
    res.send(UserOrderList);
}

module.exports = {
getOrders,
addOrder,
getOrder,
updateOrder,
deleteOrder,
totalSales,
getOrderCount,
getUserOrders,
}