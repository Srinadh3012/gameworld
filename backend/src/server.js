require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { initializeFirebaseAdmin } = require('./config/firebaseAdmin');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const { initSocket } = require('./socket');
initSocket(server);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all /api routes
app.use('/api/', apiLimiter);

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
app.use('/api/players/me/npcs', require('./routes/npcs'));
app.use('/api/story', require('./routes/story'));
app.use('/api/guardians', require('./routes/guardians'));
app.use('/api/world/transformations', require('./routes/worldTransformations'));
app.use('/api/endgame', require('./routes/endgame'));
app.use('/api/social', require('./routes/social'));

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
server.listen(PORT, () => {
  console.log(`GAMEWORLD API running on port ${PORT}`);
});
