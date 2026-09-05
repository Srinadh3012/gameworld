const { Server } = require('socket.io');
const { socketAuth } = require('./auth');
const setupRooms = require('./rooms');
const setupMovement = require('./movement');
const setupSocial = require('./social');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user?.uid})`);

    setupRooms(io, socket);
    setupMovement(io, socket);
    setupSocial(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
}

module.exports = { initSocket, getIo };
