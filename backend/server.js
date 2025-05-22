const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/userModel');
const Item = require('./models/itemsModel');
// const connectDB = require('./config/connectDB');  // Path to your DB connection setup
const userRoutes = require('./routes/userRoutes');  // Correct path to userRoutes
const { authenticateToken } = require('./middlewares/authMiddleware');
// const connectDB = require('./config/db');
// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(cors());

// Import routes
// const userRoutes = require('./routes/userRoutes');
app.use(express.json());
app.use('/api/users', userRoutes);
// app.use('/Dashboard', userRoutes);
app.use('/api/users/verify',authenticateToken);
// app.use('/api/updateProfile',userRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();


// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
