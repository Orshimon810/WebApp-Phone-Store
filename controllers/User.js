const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req,res) { 
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
}

async function getAllUsers (req,res) {
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success:false});
    }
    res.send(userList);
}

async function getUser(req,res){
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(404).json({ success: false, message: 'User with this ID has not found' });
    }
    res.status(200).send(user);
}

async function login(req, res) {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('User has not found');
    }

    console.log('Stored Password Hash:', user.passwordHash);
    console.log('Given Password:', req.body.password);

    if(bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            secret,{
                expiresIn:'1d'
            });

        res.status(200).send({user:user.email,token:token});
    }
    else{
        res.status(400).send('password is wrong');
    }
}


module.exports = {
    register,
    getAllUsers,
    getUser,
    login,
}