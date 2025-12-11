# 🚗 Kien Cuong Auto

![Project Status](https://img.shields.io/badge/status-live-success.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Stack](https://img.shields.io/badge/stack-MERN-blue.svg)

> **Kien Cuong Auto** is a full-stack web application designed to manage car dealership operations, including inventory tracking, branch management, and customer services. The system is fully deployed and secured on a Linux VPS.

## 🌐 Live Demo

👉 **Website:** [https://kiencuongauto.vn](https://kiencuongauto.vn)  
*(Note: System is running on Ubuntu VPS with Nginx Reverse Proxy & SSL)*

## 🛠️ Tech Stack

This project demonstrates a complete **Software Development Life Cycle (SDLC)** from coding to deployment.

### 💻 Frontend (Client)
- **React.js**: Functional Components, Hooks.
- **State Management**: Context API / Redux.
- **Routing**: React Router v6.
- **UI/UX**: Responsive design with CSS/SCSS.
- **API Client**: Axios (with Interceptors).

### 🔙 Backend (Server)
- **Node.js & Express**: High-performance RESTful API.
- **Database**: MongoDB (Mongoose ORM) for flexible data modeling.
- **Authentication**: JWT (JSON Web Token) & Bcrypt (Password Hashing).
- **Security**: HTTP-Only Cookies, Input Validation, CORS configuration.

### ⚙️ DevOps & Deployment (Highlight)
- **Server**: Ubuntu 20.04/22.04 LTS VPS.
- **Web Server**: Nginx (Reverse Proxy configuration).
- **Security**: SSL/TLS Certificate (Let's Encrypt) via Certbot.
- **Process Management**: PM2/Systemd for zero-downtime reload.
- **Firewall**: UFW configured for specific ports.

---

## 🔑 Key Features

### 1. Authentication & Security
- 🔐 Secure Login/Register/Logout flow.
- 🛡️ Role-based Authorization (**Admin** vs **User**).
- 🍪 Secure Cookie management (SameSite/Secure attributes).

### 2. Vehicle Inventory (CRUD)
- View list of available cars with filters.
- Admin: Add, Edit, Delete vehicle information (Images, Price, Specs).

### 3. Branch Management
- Manage multiple dealership locations.
- Real-time updates across the system.

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)
- Git

### 1. Clone the repository
```bash
git clone [https://github.com/justccuong/KienCuongAuto.git](https://github.com/justccuong/KienCuongAuto.git)
cd KienCuongAuto
````

### 2\. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start the server:

```bash
npm start
# Server runs on http://localhost:5000
```

### 3\. Frontend Setup

```bash
cd frontend
npm install
```

Start the React app:

```bash
npm start
# App runs on http://localhost:3000
```

-----

## 📂 Project Structure

```bash
KienCuongAuto/
├── backend/                 # Node.js & Express Server
│   ├── config/              # Database & Environment Configs
│   ├── controllers/         # Business Logic Handlers
│   ├── middleware/          # Authentication & Upload Middleware
│   ├── models/              # Mongoose Schemas (User, Car, Branch)
│   ├── routes/              # API Endpoint Definitions
│   ├── seed/                # Database Seed Data
│   ├── utils/               # Utilities (Cloudinary, etc.)
│   └── server.js            # Server Entry Point
│
├── frontend/                # ReactJS (Vite) Client
│   ├── public/              # Static Assets (Images, Icons)
│   └── src/
│       ├── components/      # Reusable UI Components
│       │   ├── input/       # Form Controls (Select, Button...)
│       │   ├── layouts/     # Layout Wrappers (Header, Footer)
│       │   ├── sections/    # Major Page Sections (Hero, Services)
│       │   └── ui/          # Basic UI Elements (Cards, Pagination)
│       ├── pages/           # Main Application Views
│       │   ├── Admin/       # Admin Dashboard
│       │   ├── Auth/        # Login & Registration
│       │   ├── Branches/    # Branch Management
│       │   ├── Car/         # Car Listing & Details
│       │   └── Home/        # Landing Page
│       ├── utils/           # Axios Config & Helpers
│       ├── App.jsx          # Routing Setup
│       └── main.jsx         # React DOM Root
│
└── package.json
```

-----

## 👨‍💻 Author

  - **GitHub:** [github.com/justccuong](https://github.com/justccuong)
  - **Role:** Full-stack Developer & DevOps

-----

*If you find this project helpful, please give it a star ⭐\!*

```
