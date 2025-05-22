
const Order = require('../models/orderModel');
const User = require('../models/userModel'); // Ensure this import is correct
const Item = require('../models/itemsModel');
const bcrypt = require('bcrypt');

const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("userID got in order:", userId);
    const user = await User.findById(userId).populate('Cart.items.item');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const items = user.Cart.items.map(cartItem => {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedOtp = bcrypt.hashSync(otp, 8);

      return {
        item: cartItem.item._id,
        // quantity: cartItem.quantity,
        otp: hashedOtp,
        plainOtp: otp // Send the plain OTP back to the frontend
      };
    });

    const totalAmount = user.Cart.items.reduce((total, cartItem) => total + cartItem.item.Price, 0);

    const order = new Order({
      user: userId,
      // itemsordered: items,
      itemsordered: items.map(item => ({
        item: item.item,
        otp: item.otp
      })),
      totalAmount,
    });

    await order.save();

    // Update the status of the ordered items
    for (const cartItem of user.Cart.items) {
      const item = await Item.findById(cartItem.item._id);
      item.status = 'ordered';
      await item.save();
    }

    // Add the order to the user's order history
    user.Orders.push(order._id);

    // Clear the user's cart
    user.Cart.items = [];
    user.cartCounter = 0;
    await user.save();

    const plainOtps = items.map(item => ({
      itemId: item.item,
      otp: item.plainOtp
    }));

    res.status(201).json({order, otps: plainOtps});
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: 'Orders',
      populate: {
        path: 'itemsordered.item',
        model: 'Item'
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Map over the orders to include the status of each item
    const ordersWithStatus = user.Orders.map(order => {
      const itemsWithStatus = order.itemsordered.map(item => ({
        ...item.toObject(),
        status: item.item.status,
        sellerId: item.item.Seller // Include the sellerId for comparison
      }));
      return {
        ...order.toObject(),
        itemsordered: itemsWithStatus
      };
    });

    res.status(200).json(ordersWithStatus);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: error.message });
  }
};

const getDeliveredByUser = async (req, res) => {
  try {
    console.log("Came ");
    const { userId } = req.params;
    console.log("Fetching delivered items for user:", userId);
    const items = await Item.find({ Seller: userId, status: 'delivered' });
    console.log(items);
    if (!items || items.length === 0) {
      return res.json({ message: 'No delivered items found for this user' });
    }
    console.log("came here");

    // Map over the items to include the necessary details
    const deliveredItems = items.map(item => ({
      itemId: item._id,
      itemName: item.ItemName,
      price: item.Price,
      status: item.status,
      sellerId: item.Seller,
      // sellerName: item.Seller.name,
      // orderId: item.Orders[0], // Assuming each item belongs to at least one order
      // createdAt: item.createdAt
    }));

    res.status(200).json(deliveredItems);
  } catch (error) {
    console.error('Error fetching delivered items:', error);
    res.status(500).json({ message: error.message });
  }
};


const getSellerOrders = async (req, res) => {
  try {
      const { sellerId } = req.params;
      const items = await Item.find({ Seller: sellerId, status: 'ordered' }).populate('Seller');
      const orders = await Order.find({ 'itemsordered.item': { $in: items.map(item => item._id) } }).populate({
          path: 'itemsordered.item',
          model: 'Item'
      });

      // Convert images to Base64
      const ordersWithImages = orders.map(order => ({
          ...order.toObject(),
          itemsordered: order.itemsordered.map(item => ({
              ...item.toObject(),
              item: {
                  ...item.item.toObject(),
                  Image: item.item.Image && item.item.Image.data
                      ? `data:${item.item.Image.contentType};base64,${item.item.Image.data.toString('base64')}`
                      : null,
              },
          })),
      }));

      res.status(200).json(ordersWithImages);
  } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { orderId, itemId, otp } = req.body;
    console.log("OrderId, itemId, otp:", orderId, itemId, otp);
    // const hashedOtp = bcrypt.hashSync(otp, 8);
    // console.log("Hashed OTP:", hashedOtp);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // console.log("Order found:", order);

    // const item = order.itemsordered.find(item => {
    //   console.log("Item ID Type:", typeof item._id.toString(), "Provided ID Type:", typeof itemId);
    //   console.log("Item OTP Type:", typeof item.otp, "Provided OTP Type:", typeof hashedOtp);
    //   return item._id.toString() === itemId.toString() && item.otp.toString() === hashedOtp.toString();
    // });

    const item = order.itemsordered.find(item => item._id.toString() === itemId.toString());
    if (!item) {
      return res.status(400).json({ message: 'Item not found in order' });
    }
   

    const isOtpValid = bcrypt.compareSync(otp, item.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the item status to "delivered" in the Item collection
    const itemToUpdate = await Item.findById(item.item);
    if (itemToUpdate) {
      itemToUpdate.status = 'delivered';
      await itemToUpdate.save();
    }

    // Update the item status to "delivered" in the Order document
    item.status = 'delivered';
    await order.save();

    console.log("OTP verified successfully and item status updated to delivered");

    res.status(200).json({ message: 'OTP verified successfully and item status updated to delivered' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createOrder, getOrderHistory, getSellerOrders, verifyOtp, getDeliveredByUser};