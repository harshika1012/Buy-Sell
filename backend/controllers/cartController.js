const User = require('../models/userModel');
const Item = require('../models/itemsModel');
const Cart = require('../models/cartModel');

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const item = await Item.findById(itemId);
    if(!itemId){
      return res.status(404).json({messsage: 'Item not found'});
    }
    console.log("item details from cart:",item);
    if(item.Seller == userId){
      console.log("came here");
      return res.json({message: 'Seller and Buyer are same!!!'});
    }
    console.log("Came down");
    const itemExists = user.Cart.items.some(cartItem => cartItem.item.toString() === itemId);
    if (itemExists) {
      return res.status(400).json({ message: 'Item already in cart' });
    }

    user.Cart.items.push({ item: itemId });
    user.cartCounter += 1;

    await user.save();

    res.status(200).json({message: 'Item added successfully!!'});
  } catch (error) {
    // console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message });
  }
};


const getCart = async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate({
          path: 'Cart.items.item',
          model: 'Item'
      });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Convert images to Base64
      const cartWithImages = user.Cart.items.map(cartItem => ({
          ...cartItem.toObject(),
          item: {
              ...cartItem.item.toObject(),
              Image: cartItem.item.Image && cartItem.item.Image.data
                  ? `data:${cartItem.item.Image.contentType};base64,${cartItem.item.Image.data.toString('base64')}`
                  : null,
          },
      }));

      res.status(200).json({
          user: {
              FirstName: user.FirstName,
              LastName: user.LastName,
              Email: user.Email,
          },
          cart: {
              items: cartWithImages,
          },
          cartCounter: user.cartCounter,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.Cart.items.findIndex(item => item.item.toString() === itemId);
    if (itemIndex > -1) {
      user.Cart.items.splice(itemIndex, 1);
      user.cartCounter -= 1;
      await user.save();
      return res.status(200).json(user.Cart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    // console.error('Error removing from cart:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addToCart, getCart, removeFromCart };