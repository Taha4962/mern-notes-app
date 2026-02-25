# 📝 MERN Notes Application — V2

A full-stack **Notes Application** built with the MERN stack (MongoDB, Express, React, Node.js). Features user authentication, CRUD operations, tagging, pinning, search, dark mode, and a responsive modern UI.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | Register & login with bcrypt password hashing + JWT tokens |
| 📝 **Full CRUD** | Create, read, update, and delete notes |
| 🏷️ **Tags** | Organize notes with color-coded tag chips |
| 📌 **Pin Notes** | Pin important notes to always appear at the top |
| 🔍 **Search** | Real-time regex search across titles and content |
| 🌙 **Dark Mode** | Beautiful dark theme with persistent toggle |
| 📱 **Responsive** | Mobile-first grid layout (1→2→3 columns) |
| ⚡ **Loading States** | Spinners and disabled states during API calls |
| 🛡️ **Rate Limiting** | Brute-force protection on auth endpoints |
| 🔄 **Auto-Redirect** | 401 response interceptor for expired token handling |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite 6
- **Tailwind CSS 3.4** with custom dark mode
- **React Router 7** with protected routes
- **Axios** with request/response interceptors
- **Moment.js** for date formatting

### Backend
- **Node.js** with Express 4
- **MongoDB** + Mongoose ODM
- **bcrypt** for password hashing
- **JWT** for token-based authentication
- **express-rate-limit** for API protection

---

## 📁 Project Structure

```
Notes-Application/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Mongoose schemas (User, Note)
│   │   ├── routes/            # API route definitions
│   │   ├── utilities.js       # Auth middleware
│   │   └── index.js           # Express server entry
│   ├── .env.example           # Environment template
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Navbar/            # Navigation with dark mode toggle
│   │   ├── cards/             # NotesCard, ProfileInfo, EmptyCard
│   │   ├── Input/             # PasswordInput, TagInput
│   │   ├── searchBar/         # SearchBar component
│   │   ├── ToastMeassage/     # Toast notifications
│   │   └── PrivateRoute.jsx   # Route guard
│   ├── pages/
│   │   ├── Home/              # Dashboard + Add/Edit modal
│   │   ├── Login/             # Login page
│   │   └── SignUp/            # Registration page
│   ├── utils/                 # Axios instance, helpers, constants
│   └── index.css              # Global styles + Tailwind layers
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Taha4962/mern-notes-app.git
cd mern-notes-app
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and client URL
npm install
npm start           # Starts on port 8000
```

### 3. Frontend Setup
```bash
# From root directory
npm install
npm run dev         # Starts on port 5173
```

### 4. Environment Variables

#### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 8000) |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | JWT signing secret |
| `CLIENT_URL` | Frontend URL for CORS |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/register` | Register new user |
| `POST` | `/api/v1/users/login` | Login & get JWT |
| `GET` | `/api/v1/users/get-user` | Get authenticated user |

### Notes (requires auth)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/notes/add-note` | Create a note |
| `PATCH` | `/api/v1/notes/edit-note/:id` | Update a note |
| `GET` | `/api/v1/notes/get-all-notes` | Get all user notes |
| `DELETE` | `/api/v1/notes/delete-note/:id` | Delete a note |
| `PATCH` | `/api/v1/notes/update-note-pinned/:id` | Pin/unpin a note |
| `GET` | `/api/v1/notes/search-note?query=` | Search notes |

---

## 📸 Screenshots

> _Add your screenshots here after running the app!_
> 
> Suggested screenshots:
> - Login page (light & dark mode)
> - Dashboard with notes
> - Add/Edit note modal
> - Mobile responsive view

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcrypt** (salt rounds: 10)
- ✅ JWT tokens with **7-day expiry**
- ✅ **Rate limiting** on auth routes (20 req / 15 min)
- ✅ **CORS** restricted to configured client URL
- ✅ Global error handler prevents stack trace leaks
- ✅ Protected routes on both frontend and backend

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by **Taha Khan**
