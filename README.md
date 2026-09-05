# GAMEWORLD

The World That Remembers

## Description
GAMEWORLD is a persistent exploration-driven world where players discover memories, make meaningful choices, interact with intelligent characters, overcome environmental Guardians, and shape a world that remembers them. The world dynamically responds to your legacy, culminating in profound endgame thresholds.

## Features
- **Exploration:** Traverse diverse 3D environments with dynamic landmarks.
- **World Memory & Evolution:** Your actions leave permanent, globally visible memories and physically alter the region.
- **Guardians:** Massive environmental puzzles requiring strategy and unique abilities to overcome.
- **Crafting & Inventory:** Gather resources, combine them, and forge tools.
- **Social Exploration:** Find other Explorers, chat, emote, and team up for cooperative events in real-time.
- **Player Legacy:** Track your impact, archetype evolution, and progression over time.

## Architecture & Tech Stack
- **Frontend:** React, Three.js (@react-three/fiber), TailwindCSS, Framer Motion, Zustand/Context API, Socket.IO Client.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, Firebase Admin (Auth).
- **Security:** Token-based Authentication, API Rate Limiting, Ownership validation.

## Local Setup
1. `npm install` in both `/frontend` and `/backend`.
2. Configure `.env.local` in `/frontend` and `.env` in `/backend` (see `.env.example` files).
3. Start Backend: `cd backend && npm start` (or `npm run dev`).
4. Start Frontend: `cd frontend && npm run dev`.

## Environment Variables
- `MONGODB_URI`: Connection string to your MongoDB cluster.
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`: For backend token validation.
- `VITE_FIREBASE_*`: Public Firebase config for frontend.

## Gameplay Controls
- **Move:** W A S D
- **Jump:** SPACE
- **Interact:** E
- **Sprint:** Shift
- **Inventory:** TAB
- **Social / Party / Emotes:** P / O / B
- **Pause Menu:** ESC

## Deployment & Testing
Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for production release instructions. 
Run `npm run build` in `/frontend` to verify production assets.
