  
// const bcrypt = require('bcrypt');
// const User = require("/models/User");

//   async function login(req, res) {
   
//   }

//   async function register(req,res){
//     let user = new User({
//       name:req.body.name,
//       isAdmin:req.body.isAdmin,
//       email:req.body.email,
//       passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
//       apartmant:req.body.apartmant,
//       city:req.body.city,
//       zip:req.body.zip,
//       country:req.body.country,
//       phone:req.body.phone,
//     });

//     user = await user.save();
    
//     if(!user){
//       return res.status(400).send('The user cannot be created!!!')
//     }

//     res.send(user);
//   }



//  module.exports = {
//     register,
//     login,
//  }