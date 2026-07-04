const mongoose = require('mongoose');

const dbConnect = async (req, res, next) => {
  // If already connected, proceed
  if (mongoose.connection.readyState >= 1) {
    return next();
  }

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables.');
    return res.status(500).json({ message: 'Database configuration missing' });
  }

  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
    return next();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ message: 'Database connection failed' });
  }
};

module.exports = dbConnect;
