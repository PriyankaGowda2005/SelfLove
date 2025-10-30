
// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI, fallback to Atlas cluster
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://priyanka636192:Priyanka@cluster0.hqrqzgl.mongodb.net/SelfLove';
    
    // Ensure we're connecting to the SelfLove database
    const finalURI = mongoURI.includes('srp-crm') 
      ? mongoURI.replace('srp-crm', 'SelfLove')
      : mongoURI;
    
    const conn = await mongoose.connect(finalURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;