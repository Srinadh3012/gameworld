const admin = require('firebase-admin');

async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.user = decodedToken;
    next();
  } catch (error) {
    console.error('Socket authentication failed:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
}

module.exports = { socketAuth };
