const mongoose = require("mongoose"); // Import mongoose 


// const mongoUrl='mongodb+srv://ravikumar:ravikumar1@cluster0.pu7uw.mongodb.net/'
// Define the MongoDB connection URL
mongoose.connect('mongodb://localhost:27017/my_database'); 
// mongoose.connect(mongoUrl); 

const db = mongoose.connection;

db.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully!') ; 
});

db.on('error', (err) => {
  console.error("❌ MongoDB connection error:", err); 
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected.'); 
});

module.exports = db;
