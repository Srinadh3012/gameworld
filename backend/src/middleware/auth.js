const { admin } = require('../config/firebaseAdmin');

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No Bearer token provided.',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Server auth configuration error',
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach verified user info to the request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error('Auth verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = { verifyAuth };
