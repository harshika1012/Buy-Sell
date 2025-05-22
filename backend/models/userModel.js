const mongoose = require("mongoose");
const itemSchema = require('./itemsModel').schema;
const cartItemSchema = require('./cartModel').schema;
const orderSchema = require('./orderModel').schema;

// Define the User schema
const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  Contact: {
    type: Number,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Cart: {
    // type: Number,
    // default: 0,
    items: [cartItemSchema],
  },
  // Order: {
  //   ordered: [orderSchema],
  // },
  cartCounter: {
    type: Number,
  },
  Reviews: {
    type: String,
    // default: "No reviews yet",
  },
  // Items: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'itemSchema'
  // }]
  Items: [itemSchema],
  Orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
});


// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model
