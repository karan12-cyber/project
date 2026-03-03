# project
A Real World Project
🏋️ Project Title: Smart Gym Management System
🎯 Objective

To create a full-stack web application that manages gym members, trainers, payments, workouts, and attendance digitally.

👥 User Roles
1️⃣ Owner / Admin

Add / Remove Members

Add Trainers

Create Membership Plans

Track Payments

View Reports (Revenue, Active Members)

Send Notifications

2️⃣ Trainer

View Assigned Members

Create Workout Plans

Track Member Progress

Mark Attendance

3️⃣ Member

Login / Register

View Workout Plan

Track Progress

View Payment Status

Renew Membership

Book Personal Training

🛠 Tech Stack (Recommended)

Since you're learning backend & React:

Frontend:

React (Vite)

Tailwind CSS

Axios

React Router

Backend:

Node.js

Express.js

MongoDB

JWT Authentication

Bcrypt (password hashing)

🗂 Main Features Breakdown
🔐 1. Authentication System

Register (Member/Trainer)

Login

Role-based access

JWT token

👤 2. Member Management

Add Member

Update Profile

Delete Member

View All Members

Membership expiry tracking

💳 3. Payment Management

Add Payment

Payment History

Membership Plan (Monthly / Quarterly / Yearly)

Auto expiry date calculation

🏋️ 4. Workout Management

Trainer assigns workout

Member views workout

Track completion status

📅 5. Attendance System

Daily attendance marking

Attendance history

Monthly report

📊 6. Dashboard
Owner Dashboard:

Total Members

Active Members

Expired Members

Monthly Revenue

Trainer Dashboard:

Assigned Members

Today’s Schedule

Member Dashboard:

Current Plan

Workout Today

Membership Expiry Date

---

## How to run

### Option A: Backend only (static HTML + API)
1. Install dependencies: `npm install`
2. Copy `.env` or set `PORT=5000` and `MONGO_URI=mongodb://127.0.0.1:27017/gym-app` (MongoDB is optional; server runs without it)
3. Start server: `npm start` or `npm run dev`
4. Open http://localhost:5000 for the IronFit static page, or http://localhost:5000/api/gym/welcome for the API

### Option B: React frontend (Ragnarok Fitness)
1. Backend: from project root run `npm start` (port 5000)
2. Frontend: `cd frontend/gymapplication` then `npm install` and `npm run dev`
3. Open http://localhost:5173 for the React app (API calls to `/api` are proxied to the backend)
