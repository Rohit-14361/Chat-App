# Real-Time Chat Application

A high-performance, premium-designed real-time chat application built using **React** for the frontend, and **Node.js + Express + Socket.io** for the backend, with data persistence managed via **MongoDB** and media uploads processed through **Cloudinary**.

**Live Demo URL**: [https://chat-app-kappa-sand-60.vercel.app/](https://chat-app-kappa-sand-60.vercel.app/)

---

## Features

- **Real-Time Messaging**: Deliver and receive messages instantly using Socket.io without page refreshes.
- **Message History**: Fetch previous messages from MongoDB, persistent even after refreshes.
- **User Authentication**: Secure signup and login flow with password hashing (bcrypt), JSON Web Tokens (JWT), and cookie storage.
- **Protected Routes**: Navigation guards (`ProtectedRoute` and `OpenRoute`) to protect the dashboard interface.
- **Online/Offline Status**: Real-time visual indicators showing which users are currently active.
- **Typing Indicators**: Live visual cues showing when a chat partner is typing.
- **Image Sharing**: Send images within the chat or update user profile pictures, both uploaded securely to Cloudinary.
- **Premium Aesthetics**: Cohesive, responsive slate-dark theme with smooth fade-in animations and glassmorphic UI panels.

---

## Directory Structure

```
chat-app/
├── backend/
│   ├── config/             # DB connection, Socket.io, Cloudinary setups
│   ├── controller/         # User auth and Message database controllers
│   ├── middleware/         # JWT-based authorization guard
│   ├── models/             # Mongoose schemas (User, Message)
│   ├── routes/             # REST route mappings
│   ├── utils/              # Image upload helper functions
│   ├── index.js            # Express server entrypoint
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # UI elements (guards, CTA Buttons)
    │   ├── features/       # Redux Toolkit config and state slices
    │   ├── pages/          # Login, Signup, Chat Dashboard views
    │   ├── services/       # Axios wrappers and API connectors
    │   ├── App.jsx         # App router and global socket listener
    │   ├── index.css       # Tailwind CSS v4 styling
    │   └── main.jsx        # Mount point with Redux Provider
    ├── vite.config.js
    └── package.json
```

---

## Environment Variables

Copy the environment template files (`.env.example`) to `.env` in their respective directories and fill in your credentials.

### Backend Configuration

1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Open `backend/.env` and update the values:
   ```env
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/chat_app
   JWT_SECRET=your_jwt_secret_key_here

   # Cloudinary credentials (required for image sharing & avatar updates)
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=chat_app_uploads
   ```

### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Open `frontend/.env` and update the backend URL if different:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

---

## API Reference

The backend exposes the following REST API endpoints. For authenticated endpoints, the authorization token is parsed from either the `token` cookie or the `Authorization: Bearer <token>` header.

### User Authentication & Profile (`/api/v1`)

| Method | Endpoint | Auth Required | Description | Payload Format |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/signup` | No | Registers a new user, hashes the password, and returns a session cookie / JWT token. | `{ "name": "...", "email": "...", "password": "..." }` |
| **POST** | `/login` | No | Validates credentials and returns a session cookie / JWT token. | `{ "email": "...", "password": "..." }` |
| **POST** | `/logout` | No | Clears the session cookie to log the user out. | None |
| **PUT** | `/update-profile` | Yes | Uploads a profile photo to Cloudinary and updates user details. | Multipart Form-Data: `profileImage` (File) |
| **GET** | `/health` | No | Health check endpoint to verify backend status. | None |

### Messages & Directory (`/api/v2`)

| Method | Endpoint | Auth Required | Description | Payload Format |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/get-users/sidebar` | Yes | Retrieves all registered users except the logged-in user. | None |
| **GET** | `/get-message/:id` | Yes | Fetches chat history between the logged-in user and the user specified by `:id`. | Path Parameter: `id` |
| **POST** | `/send/:id` | Yes | Sends a text and/or image message to the user specified by `:id`. Also triggers a real-time socket emit. | Path Parameter: `id`<br>Multipart Form-Data: `text` (String, optional), `image` (File, optional) |

---

## Setup & Running Instructions

### Prerequisites

Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your local machine.

### 1. Database Start

Ensure your local MongoDB database service is running:
- **Windows**: Run `net start MongoDB` or verify the MongoDB server service is active in Services.
- **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`.

### 2. Install Dependencies

Install all dependencies for both the frontend and backend projects from the root directory:
```bash
npm run install:all
```

### 3. Start the Application

You can start the application with a single command running concurrently, or run them individually in separate terminal sessions.

#### Option A: Start Frontend & Backend Concurrently (Recommended)

From the root directory, run:
```bash
npm run dev
```
*This starts both the backend on [http://localhost:3000](http://localhost:3000) and the frontend client on [http://localhost:5173](http://localhost:5173) in a single shell.*

#### Option B: Start Services Individually

If you prefer to run them in separate terminal windows:

1. **Run Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   *The backend will run on [http://localhost:3000](http://localhost:3000).*

2. **Run Frontend Client**:
   ```bash
   cd frontend
   npm run dev
   ```
   *The client will spin up on [http://localhost:5173](http://localhost:5173).*

---

## Design Decisions

1. **Integrated Server Architecture**:
   - Instead of starting separate express servers and socket servers, we bound Socket.io to the exact same HTTP instance exported from `socket.js`, ensuring they run on the same port and eliminate socket-to-API port mismatches.

2. **Tailwind CSS v4 with Vite**:
   - Configured Tailwind v4 using `@tailwindcss/vite` plugin. It is compile-free, configuration-free, and handles high-fidelity dark glassmorphic designs natively in the stylesheet.

3. **Global Socket Lifecycle Hook**:
   - Initialized the Socket connection inside the root `App.jsx` React lifecycle using a centralized `socketService.js`. When a user authenticates, the client connects to Socket.io. When logging out, it is disconnected. This prevents multiple socket handshakes and avoids memory leaks.

4. **REST + Socket Blend**:
   - Messages are sent via standard REST POST APIs. Upon successful write to the DB, the server broadcasts the event to the recipient via Socket.io. This ensures that if the recipient is offline, the database still persists the transaction safely, and if online, the delivery is instantaneous.

---

## Assumptions Made

1. **MongoDB Availability**:
   - Assumed that MongoDB is running locally at `mongodb://localhost:27017/chat_app`. If you have a different connection string (e.g. MongoDB Atlas), update the `MONGO_URL` inside `backend/.env`.
2. **Cloudinary Configuration**:
   - Assumed the Cloudinary credentials inside `backend/.env` are valid or will be populated by the user. If they are invalid, avatar updates and image shares will fail with a Cloudinary upload error.
3. **Local Dev Environment**:
   - Assumed the application runs locally where frontend is served on `http://localhost:5173` and backend runs on `http://localhost:3000`. Cross-Origin Resource Sharing (CORS) handles this specific configuration.
