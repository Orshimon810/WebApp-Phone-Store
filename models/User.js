const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
       trim: true,
       lowercase: true
     },
     isAdmin: {
        type: Boolean,
        default:false,
      },
    email: {                //Unique email for each user
       type: String,
       required: true,
       unique: true,   
       lowercase: true,
         validate( value ) {
               if( !validator.isEmail( value )) {
                    throw new Error( 'Email is invalid' )
                     }
                }
      },
    passwordHash: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) { // Password validation
           if( value.toLowerCase().includes('password')) {
           throw new Error('password must\'t contain password')
          }
       }
    },
    street: {
      type: String,
      default:"",
    },
    apartmant: {
      type: String,
      default:"",
    },
    city: {
      type: String,
      default:"",
    },
    zip: {
      type: String,
      default:"",
    },
    country: {
      type: String,
      default:"",
    },
    phone: {
      type: String,
      default:"",
    },
    timestamps: true
  });

  userSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });

  userSchema.set('toJSON',{
    virtuals:true,
  });


    const User = mongoose.model('User', userSchema) //Exports the user schema
    module.exports = User