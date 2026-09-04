require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { initializeFirebaseAdmin } = require('./config/firebaseAdmin');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Initialize Services
connectDB();
initializeFirebaseAdmin();

// Routes
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  
  if (isDbConnected) {
    res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } else {
    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

// Import route modules
app.use('/api/players', require('./routes/players'));
app.use('/api/worlds', require('./routes/worlds'));
app.use('/api/creations', require('./routes/creations'));

// Specific /api/events route for updates (since GET/POST are under /api/worlds/:id/events)
const { verifyAuth } = require('./middleware/auth');
const { updateEvent } = require('./controllers/eventController');
app.patch('/api/events/:id', verifyAuth, updateEvent);

// Global Error Handler (must be last)
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Start Server
app.listen(PORT, () => {
  console.log(`GAMEWORLD API running on port ${PORT}`);
});
