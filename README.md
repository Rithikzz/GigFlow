# GigFlow – Smart Leads Dashboard

GigFlow is a production-grade full-stack MERN (MongoDB, Express, React, Node) application designed as a smart, fast CRM dashboard for modern freelancers, agencies, and high-velocity sales squads. 

It provides seamless client management, interactive deal status tracking, visual sales pipeline breakdowns, and rich collaborative notes in a sleek modern design.

---

## ⚡ Key Highlights & Architecture

* **Modern Visual Experience:** Curated dark theme built with Tailwind CSS v4, outfit typography, glowing background accents, and responsive glassmorphism layers.
* **Type Safety:** 100% TypeScript configuration across both Vite frontend client and Express backend server.
* **Ultra-Fast State Engine:** Structured client state managed via lightweight Zustand stores with local storage persist sync.
* **Centralized Gateways:** Express server engineered with modular router structures, clean asyncHandler wraps, JWT route protecting middleware, and standardized JSON error structures.
* **Hybrid Fallbacks:** Frontend services are equipped with premium sandbox mocks, enabling high-fidelity dashboard interactions and demo pitches even before database configurations are fully provisioned.

---

## 📂 Project Directory Structure

```text
servicehive/
├── client/                     # Vite React + TypeScript Frontend
│   ├── src/
│   │   ├── api/                # Axios instance configuration & interceptors
│   │   ├── components/
│   │   │   ├── forms/          # Validation forms (React Hook Form + Zod)
│   │   │   └── layout/         # Side menu responsive Shell panel
│   │   ├── pages/
│   │   │   ├── auth/           # Login & Register views
│   │   │   ├── dashboard/      # Sales performance & metrics charts
│   │   │   └── leads/          # Interactive leads grid, details & comments drawer
│   │   ├── routes/             # Authentication Route Guards (Guest vs Protected)
│   │   ├── store/              # Zustand global state (Auth, Leads)
│   │   ├── services/           # Axios API connectors with demo mock data fallbacks
│   │   ├── types/              # Unified TypeScript interface models
│   │   ├── index.css           # Custom CSS styling variables & Tailwind v4
│   │   └── main.tsx            # Main application mounting context
│   └── package.json
│
└── server/                     # Node.js + Express + TypeScript Backend
    ├── src/
    │   ├── config/             # MongoDB database connectors
    │   ├── controllers/        # Express handlers (Auth, Leads CRUD, notes)
    │   ├── middleware/         # Route protect gates and custom error responders
    │   ├── models/             # Mongoose database schemas (User, Lead, Note)
    │   ├── routes/             # Endpoint routing bindings (authRoutes, leadRoutes)
    │   ├── utils/              # Async controller wrapper utilities
    │   └── index.ts            # Main application server listener
    └── package.json
```

---

## ⚙️ Setting Up Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cloud URI)

### Backend Configuration
1. Navigate into `server` directory:
   ```bash
   cd server
   ```
2. Set up environment variables inside `.env` (refer to `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_secret_hash_key
   CLIENT_URL=http://localhost:5173
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Navigate into `client` directory:
   ```bash
   cd client
   ```
2. Set up environment variables inside `.env` (refer to `.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Launch Vite client server:
   ```bash
   npm run dev
   ```
4. Access the client at `http://localhost:5173`. Click the 🚀 **Sandbox Demo Mode** button on the Login page to auto-fill credentials and immediately explore high-fidelity dashboard CRM workflows.

---

## 🛠️ Production Build compilation

Ensure both modules compile flawlessly prior to deployment.

### Compile Server
```bash
cd server
npm run build
```
This converts typescript models into standard node-compatible ES Module scripts inside `server/dist`. Start with `npm start`.

### Compile Client
```bash
cd client
npm run build
```
This triggers typescript compilation and vite bundlers, producing optimal static page chunks inside `client/dist`.

---

## 🛡️ API Endpoints Reference

### Authentication (Public)
* `POST /api/auth/register` — Register new admin/user accounts
* `POST /api/auth/login` — Sign in and receive JWT token bearer

### User Profile (Private)
* `GET /api/auth/me` — Grab details of currently logged-in user

### Leads CRM (Private)
* `GET /api/leads` — Get all leads in the sales cycles
* `POST /api/leads` — Create a new deal lead
* `PUT /api/leads/:id` — Update lead details
* `DELETE /api/leads/:id` — Delete a lead
* `PATCH /api/leads/:id/status` — Quick-stage changes (new, contacted, won, etc.)
* `POST /api/leads/:id/notes` — Add a collaborative note/comment
