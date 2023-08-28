const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function register(req, res) {
    try {
        console.log(req.body.password);

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('Email is already registered. Please use a different email.');
        }

        // Create a new user instance with hashed password
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

        // Save the new user to the database
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
    // Fetch all users from the database while excluding the 'passwordHash' field
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        // If userList is empty or null, send a response indicating failure
        res.status(500).json({success:false});
    }
      // Send the list of users (without passwordHash) as a successful response
    res.send(userList);
}

async function getUser(req,res){
    // Find a user by the provided ID while excluding the 'passwordHash' field
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
         // If user is not found, send a response indicating the failure
        res.status(404).json({ success: false, message: 'User with this ID has not found' });
    }

    // Send the user (without passwordHash) as a successful response
    res.status(200).send(user);
}

async function login(req, res) {
    // Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
        // If user is not found, send a response indicating the failure
        return res.status(400).send('User has not found');
    }

    console.log('Stored Password Hash:', user.passwordHash);
    console.log('Given Password:', req.body.password);

    // Compare the given password with the stored hashed password
    if(bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // Generate a JSON Web Token (JWT) with user details
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            secret,{ // Secret key for JWT signing
                expiresIn:'1d' // Token expiration time
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
         // If the password is incorrect, send an error response
        res.status(400).send('password is wrong');
    }
}

function validateUserId(req, res, next) {
    const user = req.params.id; // Get the user ID from the request parameters
  
     // Check if the user ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
  
    // If the user ID is valid, call the next middleware or route handler
    next();
  }

async function getCount (req,res){
    console.log('GET /get/count route handler called');

     // Fetch the count of documents in the User collection
    const userCount = await User.countDocuments({});

    if(!userCount)
    // Handle the case where userCount is null
        res.status(500).json({success:false,message:'Problem with user count'});

    // Send the user count as a response
    res.send({userCount:userCount});
}

function deleteUser(req, res) {
    // Find the user by ID and delete it
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                // If the user was found and deleted, send a success response
                return res.status(200).json({ success: true, message: 'user has been deleted' });
            } else {
                // If the user was not found, send a not found response
                return res.status(404).json({ success: false, message: 'user not found' });
            }
        })
        .catch(err => {
            // If an error occurred during the deletion, send an error response
            return res.status(500).json({ success: false, error: err});
        });
}

async function updateUser(req,res){
    // Check if the user with the given ID exists
    const userExist = await User.findById(req.params.id);
    let newPassword
    // Hash the new password if provided, otherwise use the existing password hash
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    // Update the user's information based on the provided data
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
        { new: true} // Return the updated user document
    )

    if(!user)
    return res.status(400).send('the user cannot be updated!');

     // Send the updated user information as a response
    res.send(user);
}

module.exports = {
    register,
    validateUserId,
    getAllUsers,
    getUser,
    login,
    getCount,
    deleteUser,
    updateUser,
}