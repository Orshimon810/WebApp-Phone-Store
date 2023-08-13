const mongoose = require('mongoose'); 

const orderSchema = new mongoose.Schema({
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true,
    }],
    shippingAdress1:{
        type:String,
        required:true,
    },
    shippingAdress2:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    zip:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    totalPrice:{
        type:Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dateOrdered:{
        type:Date,
        default:Date.now,
    },
});

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });

  orderSchema.set('toJSON',{
    virtuals:true,
});

module.exports = mongoose.model('Order',orderSchema);