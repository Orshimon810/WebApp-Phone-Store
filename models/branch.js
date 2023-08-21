const mongoose = require('mongoose'); 

const branchSchema = new mongoose.Schema({
   address:{
        type:String,
        required:true,
   },
   coordinates :{
    type:String,
   },

})

branchSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });

branchSchema.set('toJSON',{
    virtuals:true,
});

module.exports = mongoose.model('Branch',branchSchema);