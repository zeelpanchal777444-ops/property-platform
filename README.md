# Keystone — Real-Time Property Rental, Maintenance & Amenity Management Platform

A centralized digital platform that simplifies rental operations for tenants and property owners — real-time maintenance request tracking, transparent communication, and conflict-free amenity booking, all synced live across every connected user.

---

## Features

- **Authentication** — secure register/login with JWT + bcrypt password hashing
- **Property Management** — create and view properties
- **Maintenance Requests** — create requests, track status (Pending → In Progress → Completed), updates sync live across all open tabs/devices via Socket.io
- **Amenity Booking** — date & time-based booking with automatic **conflict prevention** (no double-booking)
- **Live Dashboard** — KPI cards (properties, amenities, request status breakdown, completion rate) that update in real time
- **Responsive UI** — built with React + Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Tailwind CSS |
| Real-Time Client | Socket.io-client |
| Backend | Node.js, Express.js |
| Real-Time Server | Socket.io |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT) + bcrypt |

---

## Project Structure

```
property-platform/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Navbar, ProtectedRoute
│       ├── context/        # AuthContext, SocketContext
│       ├── pages/          # Login, Register, Dashboard, Maintenance, Amenities
│       └── services/       # Axios API client
│
└── server/                 # Node + Express backend
    ├── config/             # MongoDB connection
    ├── controllers/        # Auth, Property, Maintenance, Amenity, Dashboard logic
    ├── middleware/         # JWT auth guard
    ├── models/             # Mongoose schemas
    └── routes/             # Express route definitions
```

---

## Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/property-platform.git
cd property-platform
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`) and fill in your values:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/property-platform
JWT_SECRET=your_long_random_secret_string
PORT=5000
```

Run the server:
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### 3. Frontend setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
App runs at `http://localhost:5173`

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns JWT |
| POST | `/api/properties` | Create a property *(protected)* |
| GET | `/api/properties` | List properties *(protected)* |
| POST | `/api/maintenance` | Create a maintenance request *(protected)* |
| GET | `/api/maintenance/:propertyId` | List requests for a property *(protected)* |
| PATCH | `/api/maintenance/:id/status` | Update request status *(protected)* |
| POST | `/api/amenities` | Create an amenity *(protected)* |
| GET | `/api/amenities/:propertyId` | List amenities for a property *(protected)* |
| POST | `/api/amenities/:id/book` | Book a time slot, conflict-checked *(protected)* |
| GET | `/api/dashboard/stats` | Aggregate KPI counts *(protected)* |

*Protected routes require an `Authorization: Bearer <token>` header.*

---

## Real-Time Events (Socket.io)

| Event | Fired When |
|---|---|
| `maintenanceCreated` | A new maintenance request is created |
| `maintenanceUpdated` | A request's status changes |
| `amenityBooked` | An amenity booking is confirmed |

Every connected client listens for these events and updates its UI instantly, without a page refresh.

---

## Full Documentation

See `PRD_Technical_Documentation.pdf` / `.docx` in this repo for the complete Product Requirements Document, database schema, and architecture details.

---

## License

This project was built for educational purposes as part of a Unified Mentor project submission.
