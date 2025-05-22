const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUsers = (req, res) => {
    res.json({ message: 'Get all users' });
  };
  

  const createUser = async (req, res) => {
    // console.log("Inside create user function in controller");
    try{
      // console.log("Inside try block in controller");
    const { FirstName, LastName, Email, Age, Contact, Password} = req.body;
    const cartCounter =  0;  // Provide default value if not defined
    const Reviews = "No reviews yet";  // Provide default value if not defined
    const hashedPassword = bcrypt.hashSync(Password, 10);
    // console.log('Hashed password:',hashedPassword);
    
    const newUser = new User({
      FirstName,
      LastName,
      Email,
      Age,
      Contact,
      Password: hashedPassword,
      cartCounter,
      Reviews,
    });
    console.log("New User:", newUser);
    await newUser.save();
    // console.log("Unique ID:",newUser._id);
    // const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    // console.log("JWT token = ", token);
    res.json({token,user: newUser });
    } catch(error){
      // console.log("Inside catch block in usercontroller",res.body);
      // console.error("Error in creating user from userController.js:", error);
      res.status(500).json({ message: error.message });
    }

  };

  const loginUser = async (req, res) => {
    // console.log("req.body",req.body);
    const { email, password } = req.body;
    // console.log("Email and password from login:",email,password);
    try {
      const user = await User.findOne({ Email: email.trim().toLowerCase() });
      // console.log(user);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("Generated token from loginUser bk:",token);
      res.json({ token, user });
    } catch (error) {
      // console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };


  const getUserProfile = async (req, res) => {
    // console.log("Came to profile function in backend:",req.body);
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      // console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
  
  
  module.exports = { createUser,loginUser,getUserProfile};
  