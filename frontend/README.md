# 🚀 EVEREST – Task Manager (MERN Stack)

A premium full-stack **Task Management Web App** built with the MERN stack, featuring authentication, protected routes, search, and a modern UI.

---

## 🌟 Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 🍪 Secure Cookies (httpOnly)
* 🔄 Auto Login / Session Handling
* 🚪 Auto Logout on Session Expiry
* 📋 CRUD Operations for Tasks
* 🔍 Search Tasks (Debounced)
* 📊 Progress Tracking Dashboard
* ⚡ Protected Routes (PrivateRoute)
* 🎨 Premium UI (Tailwind + Framer Motion)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios
* React Hot Toast
* Lucide Icons

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt

---

## 📁 Project Structure

```
TaskManager/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── db/
│   │   └── utils/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/task-manager.git
cd TaskManager
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=8000
MONGODB_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

1. User logs in → receives:

   * Access Token (short-lived)
   * Refresh Token (stored in DB)

2. Access Token expires:

   * Axios interceptor calls `/refresh-token`

3. If refresh fails:

   * Tokens removed
   * User auto-logged out
   * Redirect to login page

---

## 🔁 API Flow (Simplified)

```
Frontend → API Call → JWT Middleware → Controller → DB → Response
```

---

## 📊 Dashboard Flow

* Fetch tasks
* Search using query params
* Debounced input for performance
* Real-time progress calculation

---

## 🔍 Search Implementation

* Uses query param: `?search=task`
* Backend uses MongoDB `$regex`
* Frontend uses `lodash.debounce`

---

## 🧠 Architecture Overview

### 🔹 Frontend

* Context API for global auth state
* Axios interceptors for token handling
* PrivateRoute for protected navigation

### 🔹 Backend

* MVC Pattern
* Middleware-based authentication
* Token-based session management

---

## 🚀 Key Concepts Used

* JWT + Refresh Token Strategy
* REST API Design
* Secure Cookie Handling
* Debouncing (Performance Optimization)
* State Management using Context API

---

## ⚡ Future Improvements

* ⏳ Task Deadlines & Reminders
* 🧠 AI Task Suggestions
* 📱 Mobile Responsive Enhancements
* 🌐 Deployment (Vercel + Render)
* 📊 Analytics Dashboard

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, open an issue first.

---

## 📜 License

This project is licensed under the MIT License.

---

## 💡 Author

**Narendra Meshram**


---
