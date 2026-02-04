# 🎓 XamPro - Online Examination System

A premium, full-stack online examination platform built with **React**, **Node.js**, **Express**, and **SQLite**. XamPro features a sleek dark-mode UI with glassmorphism and real-time performance tracking for both teachers and students.

## ✨ Features

### 👨‍🏫 For Teachers
- **Creative Dashboard**: View total attempts, active tests, and average student performance.
- **Test Creator**: Dynamic form to build tests with multiple-choice questions.
- **Performance Monitoring**: Real-time table showing student names, test titles, scores, and dates.
- **Secure Access**: Role-based authentication ensures only teachers can create/manage tests.

### 👨‍🎓 For Students
- **Personalized Dashboard**: See available tests and a detailed history of past performances.
- **Smooth Quiz Interface**: 
  - Integrated timer (auto-submits on time-out).
  - Progress bar tracking.
  - Animated transitions between questions.
- **Instant Results**: Get your score and percentage immediately after submission.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Framer Motion (Animations), Lucide React (Icons), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (SQL) for reliable relational data storage.
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed on your machine.

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
*The server will run on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The app will be available at `http://localhost:5173`.*

## 📌 Project Structure
- `backend/server.js`: API endpoints and logic.
- `backend/db.js`: SQL schema and database connection.
- `frontend/src/pages/`: All main views (Dashboards, Test Taking, Auth).
- `frontend/src/components/`: Reusable UI elements like the Navbar.

---
Developed with ❤️ for a premium user experience.
