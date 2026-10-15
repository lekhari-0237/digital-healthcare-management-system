# HealthTrack — Your Complete Digital Healthcare Journey

> **Full Stack Academic Development Project (MERN Stack)**  
> Complete, modern, responsive Digital Healthcare Platform connecting Patients, Doctors, and Administrators end-to-end.

---

## 🌟 Project Overview

HealthTrack is a full-featured digital healthcare management system. It allows patients to manage their complete healthcare journey — from registration and diagnostic test discovery to doctor appointment scheduling, mock payment gateway processing, live consultation, digital prescription issuance, pathology report viewing/downloading, and dynamic healthcare journey timeline tracking.

### Key Capabilities:
- **Patient Portal**: Search & book diagnostic packages, book doctor consultations, track live sample status, view printable PDF reports & prescriptions, view payment receipts, and manage profile.
- **Doctor Portal**: Manage daily appointment queues, conduct interactive consultation sessions, issue itemized digital prescriptions, and update doctor profiles.
- **Admin Portal**: Executive analytics dashboard with Recharts, patient account controls, doctor catalog management, diagnostic test configuration, booking stage updates, and payment audit logs.
- **Dynamic Healthcare Journey**: Visual node timeline tracking: `BOOKED → PAYMENT COMPLETED → SAMPLE COLLECTION → TEST PROCESSING → REPORT GENERATED → REPORT AVAILABLE`.
- **Mock Payment Gateway**: Simulates card, UPI, and net banking transactions with instant transaction ID generation.
- **In-App Notifications**: Real-time notifications for bookings, status changes, and prescription issues with unread badge indicators.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React Icons
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`, `NotificationContext`)
- **HTTP Client**: Axios with JWT Token Interceptors
- **Analytics & Charts**: Recharts
- **PDF Generation**: Browser Print & Custom Styled PDF Templates

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs Password Hashing
- **Security**: CORS, Environment Variables, Role Protection Middleware (`protect`, `authorize`)
- **Architecture**: Modular Routes → Controllers → Services → Models

---

## 👥 User Roles & Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@healthtrack.demo` | `Admin@123` | Full administrative control, user management, test catalog, analytics, revenue logs |
| **Doctor** | `doctor@healthtrack.demo` | `Doctor@123` | Appointment queue, consultation room, digital prescription issuance, profile management |
| **Patient** | `patient@healthtrack.demo` | `Patient@123` | Test & doctor booking, payment simulation, report/prescription viewer, journey tracker |

---

## 📁 Repository Folder Structure

```
healthtrack/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Controller logic for all modules
│   │   ├── middleware/      # Auth & Error handling middleware
│   │   ├── models/          # Mongoose Schemas (User, Doctor, Test, Booking, Appointment, etc.)
│   │   ├── routes/          # REST Express API routes
│   │   ├── utils/           # Database seed script (seedData.js)
│   │   └── server.js        # Express application entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI, Patient, Doctor & Admin modals
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── pages/           # Public, Patient, Doctor & Admin pages
│   │   ├── routes/          # AppRoutes & Role-based ProtectedRoute
│   │   ├── services/        # Axios API service modules
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally (`mongodb://127.0.0.1:27017/healthtrack`) or a MongoDB Atlas URI.

### 1. Install Dependencies

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Verify `.env` in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/healthtrack
JWT_SECRET=healthtrack_super_secret_jwt_key_2026
NODE_ENV=development
```

### 3. Seed Database with Realistic Demo Data
Run the seeding script to populate Admin, Doctors, Tests, Patients, Appointments, Reports, and Notifications:
```bash
cd backend
npm run seed
```

### 4. Start Development Servers

**Start Backend API Server (Port 5000):**
```bash
cd backend
npm run dev
```

**Start Frontend Development Server (Port 5173):**
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 REST API Overview

- `POST /api/auth/register` — Patient registration
- `POST /api/auth/login` — User authentication & JWT issuance
- `GET  /api/doctors` — Public doctor directory with filtering
- `GET  /api/tests` — Public diagnostic test catalog
- `POST /api/test-bookings` — Reserve diagnostic test & trigger mock payment
- `POST /api/appointments` — Schedule doctor consultation
- `POST /api/prescriptions` — Issue doctor prescription & complete consultation
- `GET  /api/reports/my` — Fetch patient lab reports
- `GET  /api/admin/dashboard` — Fetch admin analytics & revenue metrics

---

## ⚠️ Academic Disclaimer
This project is developed for educational and academic Full Stack Development (FSD) demonstration purposes. All medical records, diagnostic values, and transactions are simulated.
