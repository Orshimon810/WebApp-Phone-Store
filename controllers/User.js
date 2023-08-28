const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        console.log(req.body.password);

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email is already registered. Please use a different email.');
        }

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
        });
        user = await user.save();

        if (!user)
            return res.status(400).send('The user cannot be created!');

        // After successful registration, send the redirection URL
        res.send({ message: 'User registered successfully', redirectUrl: 'mainPage.html' }); // Modify the URL as needed
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('An error occurred during registration');
    }
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

        // Send the redirection URL along with the token
        res.status(200).send({
            user: user.email,
            token: token,
            isAdmin:user.isAdmin,
            redirectUrl: 'mainPage.html' // Modify this URL as needed
        });
    }
    else{
        res.status(400).send('password is wrong');
    }
}

async function getCount (req,res){
    console.log('GET /get/count route handler called');
    const userCount = await User.countDocuments({});

    if(!userCount)
        res.status(500).json({success:false,message:'Problem with user count'});

    res.send({userCount:userCount});
}

function deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, message: 'user has been deleted' });
            } else {
                return res.status(404).json({ success: false, message: 'user not found' });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, error: err});
        });
}

async function updateUser(req,res){
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be updated!');

    res.send(user);
}

module.exports = {
    register,
    getAllUsers,
    getUser,
    login,
    getCount,
    deleteUser,
    updateUser,
}