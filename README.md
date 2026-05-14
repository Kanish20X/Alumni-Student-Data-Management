# AlumniHub – Centralized Alumni Data Management Platform

A full-stack web application built with **React** (frontend) and **Node.js/Express** (backend) for managing alumni data, events, and job postings.

---

## 🚀 Features

- 🔐 **Authentication** – Login & Register with JWT tokens (data persisted to disk)
- 👥 **Alumni Directory** – Add, edit, delete, search & filter alumni
- 📅 **Events** – Create and manage alumni events
- 💼 **Job Board** – Post and browse job opportunities
- 📊 **Dashboard** – Live stats overview
- 💾 **Persistent Storage** – All data saved in `backend/db.json`

---

## 🗂️ Project Structure

```
alumni-platform/
├── backend/
│   ├── server.js       # Express API server
│   ├── db.json         # Auto-generated database file
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/AuthContext.js
    │   ├── components/Sidebar.js + .css
    │   ├── pages/
    │   │   ├── Login.js + .css
    │   │   ├── Dashboard.js + .css
    │   │   ├── Alumni.js + .css
    │   │   ├── Events.js + .css
    │   │   └── Jobs.js + .css
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js v16+
- npm

### Step 1 – Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2 – Start the Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

### Step 3 – Install Frontend Dependencies (new terminal)
```bash
cd frontend
npm install
```

### Step 4 – Start the Frontend
```bash
npm start
# App opens on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Email             | Password   | Role  |
|-------------------|------------|-------|
| admin@alumni.com  | admin123   | Admin |

You can also register a new account from the login page.

---

## 🌐 API Endpoints

| Method | Route             | Description          |
|--------|-------------------|----------------------|
| POST   | /api/login        | Login user           |
| POST   | /api/register     | Register new user    |
| GET    | /api/alumni       | Get all alumni       |
| POST   | /api/alumni       | Add alumni           |
| PUT    | /api/alumni/:id   | Update alumni        |
| DELETE | /api/alumni/:id   | Delete alumni        |
| GET    | /api/events       | Get all events       |
| POST   | /api/events       | Create event         |
| DELETE | /api/events/:id   | Delete event         |
| GET    | /api/jobs         | Get all jobs         |
| POST   | /api/jobs         | Post a job           |
| DELETE | /api/jobs/:id     | Delete job           |
| GET    | /api/stats        | Get dashboard stats  |

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Axios, CSS3  
**Backend:** Node.js, Express, bcryptjs, jsonwebtoken  
**Storage:** JSON file-based database (db.json)
