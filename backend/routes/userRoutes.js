const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');  // Correct the path if necessary
const Item = require('../models/itemsModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {auth,authenticateToken} = require('../middlewares/authMiddleware');
const { createUser,loginUser, getUserProfile } = require('../controllers/userController');
const { createItem,getAllItems,getItemById, upload } = require('../controllers/itemsController');
const { addToCart , getCart , removeFromCart} = require('../controllers/cartController');
const { createOrder, getOrderHistory, getSellerOrders, verifyOtp, getDeliveredByUser } = require('../controllers/orderController');
// const uuid = require('uuid');
// GET request to fetch all users
router.get('/', authenticateToken, async (req, res) => {
  console.log("Iam in Get  in Route");
  try {
    const users = await User.find();  // This will work if User is correctly imported
    res.json(users);  // Send the users as JSON
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/api/login',loginUser);

router.post('/api/items', authenticateToken , upload.single('image'),createItem);

router.post('/',createUser);

router.get('/api/profile',authenticateToken,getUserProfile);

router.get('/api/items', authenticateToken, getAllItems);

router.get('/api/items/:id',authenticateToken,getItemById);

router.post('/api/cart', authenticateToken,  addToCart);
router.get('/api/cart/:userId', authenticateToken , getCart);
router.delete('/api/cart', authenticateToken, removeFromCart);


router.post('/api/order',authenticateToken, createOrder);
router.get('/api/orders/:userId', authenticateToken, getOrderHistory); 
// router.get('/api/seller/orders/:sellerId',authenticateToken,getSellerOrders);
router.get('/api/seller/orders/:sellerId', authenticateToken, getSellerOrders); // Add this route
router.post('/api/verify-otp', authenticateToken, verifyOtp); // Add this route

router.get('/api/delivered/:userId', authenticateToken, getDeliveredByUser); // Add this route



router.put('/api/updateProfile/:Id',authenticateToken, async (req, res) => {
  console.log("Iam in Backend now");
  try {
    const userId = req.params.Id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

router.get('/Profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    console.log("User from userRoute:",user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;  // Export the routes for use in server.js
