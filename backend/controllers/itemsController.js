const multer = require('multer');
const Item = require('../models/itemsModel');
const User = require('../models/userModel');

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store image in memory as a buffer
const upload = multer({ storage });

const createItem = async (req, res) => {
    try {
        const { ItemName, Price, Description, Category, Seller, Email, TokenId } = req.body;

        // Validate seller
        const sellerExists = await User.findById(Seller);
        if (TokenId !== Seller) {
            return res.status(403).json({ message: 'Unauthorized: Token does not match SellerId' });
        }
        if (!sellerExists) {
            return res.status(400).json({ message: 'Invalid SellerId' });
        }
        if (sellerExists.Email !== Email) {
            return res.status(400).json({ message: 'Email does not match the SellerId' });
        }

        // Handle image upload
        let imageData = null;
        let imageContentType = null;
        if (req.file) {
            imageData = req.file.buffer; // Store the image as a buffer
            imageContentType = req.file.mimetype; // Get the MIME type of the image
        }

        // Create new item
        const newItem = new Item({
            ItemName,
            Price,
            Description,
            Category,
            Seller,
            Email,
            Image: {
                data: imageData,
                contentType: imageContentType,
            },
        });

        await newItem.save();
        res.status(201).json({ item: newItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllItems = async (req, res) => {
  try {
      const items = await Item.find({ status: 'available' });
      const itemsWithImages = items.map(item => ({
          ...item.toObject(),
          Image: item.Image && item.Image.data
              ? `data:${item.Image.contentType};base64,${item.Image.data.toString('base64')}`
              : null,
      }));
      res.json(itemsWithImages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const getItemById = async (req, res) => {
  try {
      const item = await Item.findById(req.params.id);
      if (!item || item.status !== 'available') {
          return res.status(404).json({ message: 'Item not found or not available' });
      }

      // Convert image to Base64
      const itemWithImage = {
          ...item.toObject(),
          Image: item.Image && item.Image.data
              ? `data:${item.Image.contentType};base64,${item.Image.data.toString('base64')}`
              : null,
      };

      res.json(itemWithImage);
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createItem,getAllItems,getItemById,upload };

