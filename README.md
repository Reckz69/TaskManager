# 🚀 Task Manager Application

A full-stack **Task Management Web Application** built using **React, Node.js, Express, and MongoDB** with secure authentication and real-time task operations.

---

## 🌐 Live Demo

- 🔗 Frontend: https://task-manager-3wbo.vercel.app  
- 🔗 Backend: https://taskmanager-u7vk.onrender.com  

---

## 📌 Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication
- Secure cookie-based session handling
- Auto token refresh (silent login)

### 📝 Task Management
- Create, Read, Update, Delete tasks (CRUD)
- Mark tasks as completed
- Filter tasks (priority, status)
- Search tasks
- Pagination support

### 🎯 UI/UX
- Responsive design (mobile-friendly)
- Clean modern UI
- Toast notifications
- Protected routes

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie-based auth

### Deployment
- Frontend → Vercel  
- Backend → Render  

---

## 📂 Project Structure

```
TaskManager/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios config & API calls
│   │   ├── assets/             # Images, icons
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/            # Global state (AuthContext)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page-level components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ...
│   │   ├── routes/             # Routing setup
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/            # Business logic
│   │   ├── user.controller.js
│   │   └── task.controller.js
│   │
│   ├── models/                 # Mongoose schemas
│   │   ├── user.models.js
│   │   └── task.models.js
│   │
│   ├── routes/                 # API routes
│   │   ├── user.routes.js
│   │   └── tasks.routes.js
│   │
│   ├── middleware/             # Custom middleware
│   │   └── verifyJWT.js
│   │
│   ├── utils/                  # Helper functions
│   │   ├── asyncHandler.js
│   │   ├── apiError.js
│   │   └── apiResponse.js
│   │
│   ├── config/                 # DB & env configs
│   │   └── db.js
│   │
│   ├── app.js                  # Express app config
│   ├── server.js               # Entry point
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore


## ⚙️ Installation Guide

### 📦 Clone Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### Create `.env`

```env
PORT=8000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

### Run Backend

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env`

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Run Frontend

```bash
npm run dev
```

---

## 🔐 Authentication Flow

```
Login →
  Access Token (short-lived)
  Refresh Token (cookie)

Request →
  Access Token used

Expired →
  Refresh Token →
  New Access Token
```

---

## 🏗️ Architecture

### High-Level Flow

```
Client (React)
   ↓
Axios (withCredentials)
   ↓
Backend (Express API)
   ↓
JWT Auth + Cookies
   ↓
MongoDB
```

---

### Request Flow

```
User Action →
Frontend API Call →
Middleware (verifyJWT) →
Controller →
Database →
Response
```

---

### Auth Flow

```
Login →
  Set Cookies (accessToken + refreshToken)

Protected Route →
  verifyJWT →
    if expired →
      refresh-token →
        new accessToken
```

---

## 🔑 Important Configurations

### CORS

```js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

### Cookies

```js
{
  httpOnly: true,
  secure: true,
  sameSite: "None"
}
```

---

### Axios

```js
withCredentials: true
```

---

## 📱 Mobile Responsiveness

- Tailwind responsive design
- Flexible grid & flex layouts
- Mobile-friendly navigation

---

## 🧪 Future Improvements

- Role-based authentication
- Dark mode
- Real-time updates
- Notifications
- PWA support

---

## 🤝 Contributing

Feel free to fork and contribute!

---

## 📧 Contact

Narendra Meshram  
Email: your-email@example.com  

---

## ⭐ Acknowledgements

- MongoDB
- Vercel
- Render
- OpenAI
