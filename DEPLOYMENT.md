# GAMEWORLD Deployment Guide

## 1. Requirements
- Node.js 18+
- MongoDB Atlas cluster
- Firebase Project (Authentication & Admin SDK)
- Server for backend (e.g. Heroku, Render, DigitalOcean)
- Static host for frontend (e.g. Vercel, Netlify)

## 2. Environment Variables

### Backend `.env`
```
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gameworld?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=gameworld-xxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@gameworld-xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GEMINI_API_KEY=your_gemini_api_key_if_used
```

### Frontend `.env.local`
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=gameworld-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gameworld-xxxx
VITE_FIREBASE_STORAGE_BUCKET=gameworld-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
```

## 3. Deployment Steps

### Backend
1. Clone the repository to your server.
2. `cd backend`
3. `npm install`
4. Set production environment variables.
5. Run `npm start` (or use PM2: `pm2 start src/server.js --name gameworld-api`).

### Frontend
1. `cd frontend`
2. `npm install`
3. Set production environment variables.
4. Run `npm run build`.
5. Upload the `dist/` directory to your static host.

## 4. Security Checklist
- [ ] No `.env` files committed to Git.
- [ ] MongoDB Network Access restricted to backend IP (if possible).
- [ ] API Rate limiting enabled.
- [ ] Firebase Authorized Domains updated to include production URL.
- [ ] Production build uses HTTPS for Socket.IO and REST API.
