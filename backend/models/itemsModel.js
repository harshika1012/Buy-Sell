const mongoose = require("mongoose");

// Name
// 2. Price3. Description
// 4. Category (example: clothing, grocery, etc.)
// 5. Seller ID
// Define the User schema
const itemSchema = new mongoose.Schema({
  ItemName: {
    type: String,
    required: true,
  },
  Price: {
    type: Number, // Ensure Price is a Number
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'available',
  },
  Image: {
    data: Buffer,
    contentType: String,
  },
});

// // Create the User model
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

