const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connectDB() {
    try {
        const uri = process.env.DB_URI; // Use the URI from the .env file
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;