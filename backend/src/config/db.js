const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI configuration required in backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    
    // Parse the DB name from the connection string or connection object
    const dbName = mongoose.connection.name;
    console.log(`MongoDB connected: ${dbName}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do not log the full URI or password in production/errors
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
