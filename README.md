# AyurCare - Ayurvedic Doctor Consultation & Appointment System

**AyurCare** is an enterprise-grade, full-stack web application designed for Ayurvedic healthcare management, booking, and consultation. It has been built under a decoupled client-server architecture using a modern tech stack to provide an optimized, role-based platform for Patients, Doctors, and Administrators.

---

## 🏛️ System Architecture

AyurCare implements a decoupled full-stack architecture:

```
┌────────────────────────────────────────────────────────┐
│                  Vite React Frontend                   │
│   (TypeScript, Tailwind CSS, Recharts, Axios client)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ REST APIs (JSON over HTTP)
                           ▼
┌────────────────────────────────────────────────────────┐
│                  Node/Express Backend                  │
│       (JWT Auth, CORS, Nodemailer, REST Routers)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Prisma ORM
                           ▼
┌────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                  │
│        (Dockerized container instance on port 5432)    │
└────────────────────────────────────────────────────────┘
```

- **Frontend (Port 3000):** Built with **React 18** and **Vite**, using **TypeScript** for compile-time safety and modular structure. Uses **Tailwind CSS** for a premium glassmorphic UI, **Lucide React** for icons, and **Recharts** for vitals tracking.
- **Backend (Port 5000):** Built with **Node.js** and **Express.js**. Manages JWT sessions, role-based routing, symptom assessment algorithms, and sends transactional email alerts.
- **Database Layer:** **PostgreSQL** persistence managed via **Prisma ORM** schemas, seeding, and migration workflows.

---

## 🔑 Default Seed Credentials

The database contains default accounts for evaluation:

| Role | Email Address | Password | Key Actions to Test |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@ayurcare.com` | `patient123` | Log daily vitals, view trends graphs, download prescription receipt PDF, cancel booking. |
| **Doctor** | `panchakarma@ayurcare.com` | `doctor123` | Toggle availability days, launch Consultation Workspace, submit notes/prescriptions. |
| **Admin** | `admin@ayurcare.com` | `admin123` | View revenue/booking analytics, toggle doctor approval verification, cancel bookings. |

---

## ⚙️ Step-by-Step Launch Instructions

Follow these steps to run the application locally:

### 1. Boot the PostgreSQL Database Container
Ensure you have **Docker Desktop** installed and running, then execute in the root directory:
```bash
docker-compose up -d
```
*Note: This starts a PostgreSQL database instance mapping to local port `5432`.*

### 2. Configure & Run Backend Server
Open a terminal in the `backend/` directory:
```bash
cd backend

# Install dependencies (Prisma client will generate automatically)
npm install

# Run database migrations to apply the schemas to PostgreSQL
npx prisma migrate dev --name init

# Seed the tables with sample records
npx prisma db seed

# Launch Express server in hot-reload development mode
npm run dev
```
*Express server will launch on [http://localhost:5000](http://localhost:5000).*

### 3. Run Vite React Frontend
Open a separate terminal in the `frontend/` directory:
```bash
cd frontend

# Install client packages
npm install

# Start Vite React server
npm run dev
```
*Vite will start the client app on [http://localhost:3000](http://localhost:3000).*

---

## 🗄️ Database Schemas & Relationships

Prisma manages relationships via the following structures:
- **`User` (One-to-One with profiles):** Manages credentials, role types (`PATIENT`, `DOCTOR`, `ADMIN`).
- **`PatientProfile` (Linked to User):** Holds medical records and daily vitals log fields.
- **`DoctorProfile` (Linked to User):** Holds clinic listings, specialize fields, languages, and fees.
- **`Availability` (Many-to-One with DoctorProfile):** Day integers (`0-6` for Sun-Sat) defining when a doctor has active slots.
- **`Appointment` (Many-to-One with Patient and Doctor):** Tracks bookings, reschedule dates, and prescriptions details.
- **`Review` (Many-to-One with Patient and Doctor):** Holds ratings feedback.

---

## 📡 REST API Specifications

The server exposes endpoints at `http://localhost:5000/api`:

### 🔐 Authentication (`/api/auth`)
- `POST /auth/signup` - Registers user. Dynamically instantiates child profiles based on role.
- `POST /auth/login` - Validates passwords using bcrypt and returns a signed JWT.
- `GET /auth/me` - Validates active JWT cookie/header and returns the payload.
- `POST /auth/verify-otp` - Validates simulated 6-digit verification code (`123456`).

### 🩺 Doctors (`/api/doctors`)
- `GET /doctors` - Queries doctors directory. Supports string searches and filtering.
- `POST /doctors/profile` - Modifies bio variables (Requires `DOCTOR` role JWT).
- `POST /doctors/availability` - Updates active weekdays arrays (Requires `DOCTOR` role JWT).

### 📅 Appointments (`/api/appointments`)
- `GET /appointments` - Lists bookings. Filters based on the requester's JWT role.
- `POST /appointments` - Books a doctor slot. Validates availability and prevents double bookings.
- `PUT /appointments` - Reschedules, cancels, or completes consults. Sends email alerts.

### 📊 Vitals Tracker (`/api/health-tracker`)
- `GET /health-tracker` - Retrieves patient's logged vitals and compiles history for graphs.
- `POST /health-tracker` - Saves daily vital logs.

---

## 🧠 Rule-Based Specialist Recommendation Engine

The AI Health Assessment wizard (`/api/ai-assessment`) parses symptom keywords using a rule-based algorithm:

- **Dermatology Ayurveda:** Triggered by skin/hair symptoms. Focuses on Ama cleansing from the blood.
- **Panchakarma Specialist:** Triggered by digestive issues. Kindles the digestive fire (Agni).
- **Orthopedic Ayurveda:** Triggered by joint/back aches. Addresses bone lubrication and joint pain.
- **Ayurvedic Psychiatry:** Triggered by stress/anxiety. Calms Prana Vata and supports the mind.

### Dosha Classification Matrix:
The engine calculates weights based on symptom clusters to identify the primary Dosha imbalance:
- **Vata:** Pain, joint stiffness, bloating, anxiety, insomnia.
- **Pitta:** Inflammation, acne, burning sensations, acidity.
- **Kapha:** Weight gain, lethargy, chest congestion, sluggishness.

*Personalized diet plans, home remedies, and yoga postures are generated for the identified Dosha.*

---

## 🎓 Internship Evaluation Defense Guide (Presentation Tips)

Be prepared to explain these architectural details to your evaluators:

1. **How is Route Protection Handled?**
   - The React client uses `react-router-dom` route wrappers (`PrivateRoute` in `App.tsx`). It reads the `user` context state. If no user is logged in, it redirects to `/auth`.
   - On the backend, `authMiddleware.ts` intercepts requests, extracts the JWT, verifies it, and attaches the user data to `req.user` for role checks.

2. **How is Double Booking Prevented?**
   - In `appointmentRoutes.ts`, when a booking is requested, Prisma queries for existing appointments with the same doctor, date, and time slot that are not cancelled. If a record is found, the server returns an HTTP `409 Conflict` status, which is displayed to the user as an error.

3. **How does CORS work in this split architecture?**
   - The frontend on port 3000 requests APIs on port 5000. In `server.ts`, we register Express `cors()` middleware with allowed methods and headers to enable cross-origin resource sharing.

4. **Why use Prisma with PostgreSQL?**
   - Prisma acts as a Type-Safe Object-Relational Mapper (ORM), protecting the database from raw SQL injection vulnerabilities and allowing clean data queries.
