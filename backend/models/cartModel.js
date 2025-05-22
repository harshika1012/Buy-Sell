const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },

});

const Cart = mongoose.model("cartitems", cartItemSchema);
module.exports = Cart;