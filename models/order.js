const mongoose = require('mongoose'); 

const orderSchema = new mongoose.Schema({
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
    }],
    shippingAddress1:{
        type:String,
        default:"",
    },
    shippingAddress2:{
        type:String,
        default:"",
    },
    city:{
        type:String,
        default:"",
    },
    zip:{
        type:String,
        default:"",
    },
    country:{
        type:String,
        default:"",
    },
    phone:{
        type:String,
        default:"",
    },
    status:{
        type:String,
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