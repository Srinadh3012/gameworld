const admin = require('firebase-admin');

const initializeFirebaseAdmin = () => {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn('Firebase Admin SDK configuration missing in backend/.env. Auth verification will fail.');
      return null;
    }

    // Handle newline characters in the private key from the .env file
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('Firebase Admin SDK initialized successfully.');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    return null;
  }
};

module.exports = { admin, initializeFirebaseAdmin };
