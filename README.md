# 🚗 Kiên Cường Auto - Full-Stack Dealership Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Vite-blue.svg)](https://react.dev/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF.svg?logo=github-actions)](https://github.com/justccuong/KienCuongAuto/actions)
[![Website](https://img.shields.io/badge/Website-kiencuongauto.vn-success.svg)](https://kiencuongauto.vn)

> **Kiên Cường Auto** is a production-grade, full-stack web application designed for car dealership operations—featuring real-time vehicle inventory management, multi-branch administration, customer engagement tools, and an admin analytics dashboard. Fully deployed on an Ubuntu VPS with automated CI/CD and production hardening.

---

## 🌐 Live Production

- **Official Website:** [https://kiencuongauto.vn](https://kiencuongauto.vn)
- **Infrastructure:** Ubuntu Linux VPS • Nginx Reverse Proxy • Let's Encrypt SSL • Cloudflare CDN & WAF

---

## 🛠️ Architecture & Tech Stack

```
[ Client: React 19 + Tailwind 4 ] 
          │  (HTTPS / Cloudflare)
          ▼
[ Nginx Reverse Proxy (Port 443) ]
          │  (Proxy pass to localhost:5000)
          ▼
[ Node.js & Express 5 API (PM2 Cluster) ]
     ├── Authentication (JWT + HTTP-Only Cookie)
     ├── Security (Helmet CSP, Rate Limiting, ReDoS Sanitization)
     ├── Database: MongoDB Atlas (Mongoose 8)
     └── Media: Cloudinary CDN
```

### 💻 Frontend
- **React 19** & **Vite 6** for blazing-fast builds and HMR.
- **Tailwind CSS v4** for modern, responsive UI design tokens.
- **React Router v7** with SPA client-side routing.
- **Yet-Another-React-Lightbox** & **Swiper** for high-resolution vehicle gallery inspection.
- **Axios** with centralized request interceptors.

### 🔙 Backend
- **Node.js (v20 LTS)** & **Express 5** high-performance RESTful API.
- **MongoDB Atlas** with **Mongoose 8** schema validation and aggregation pipelines.
- **Security Suite:**
  - `helmet`: Content Security Policy configured for Cloudinary & Cloudflare.
  - `express-rate-limit`: Global request throttling & dedicated brute-force protection for Auth routes.
  - `express-mongo-sanitize` & custom Regex escaping against NoSQL Injection and ReDoS.
  - `bcrypt` & `jsonwebtoken`: Password hashing and stateless authentication stored in secure `HTTP-Only` cookies (`SameSite=None`, `Secure`).
- **Cloudinary SDK**: Cloud media management with automatic image deletion when vehicles are removed.

### ⚙️ DevOps & CI/CD Pipeline
- **Automated Deployments:** GitHub Actions workflow triggered on push to `main`:
  1. Builds frontend assets on GitHub Runners (16GB RAM) to eliminate VPS resource exhaustion (OOM).
  2. Syncs static bundle directly to `/var/www/kiencuongauto/` via SCP.
  3. Deploys backend source code via SSH, installs dependencies, and reloads PM2 (`kca-backend`) with zero downtime.
- **Process Management:** PM2 with automatic startup recovery.
- **Network & DNS:** Cloudflare proxy with TLS 1.3 and edge caching.

---

## 🔑 Key Features

### 1. Showroom & Inventory Management
- Multi-criteria vehicle filtering: Price range, manufacturer, gearbox, fuel type, drivetrain, and condition.
- High-res image carousel with interactive lightbox zoom.
- One-click contact CTA: Call hotline, copy phone number, and direct Zalo connection per branch.

### 2. Multi-Branch Operations
- Multi-location dealership showroom management.
- Dynamic fallback contact information per branch.

### 3. Analytics & Administrative Controls
- Role-based authorization (`Admin` vs `User`).
- Dashboard metrics: Page visits, top-viewed vehicles, and daily engagement charts.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v20+)
- MongoDB connection string (Local or MongoDB Atlas)
- Cloudinary credentials (optional for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/justccuong/KienCuongAuto.git
cd KienCuongAuto
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (refer to `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# Server listens on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
# Vite runs on http://localhost:5173 with proxy to http://localhost:5000/api
```

---

## 📂 Project Structure

```bash
KienCuongAuto/
├── .github/workflows/       # Automated CI/CD deployment pipelines
├── backend/
│   ├── controllers/         # Business logic handlers
│   ├── middlewares/         # Auth, Rate Limiter, Upload & Security middlewares
│   ├── models/              # Mongoose schemas (Car, Branch, User, Visit, etc.)
│   ├── routes/              # RESTful API endpoints (/api/cars, /api/auth, etc.)
│   ├── utils/               # Cloudinary & helper utilities
│   ├── .env.example         # Environment variable template
│   └── server.js            # Express server entry point
│
├── frontend/
│   ├── public/              # Static assets, logos, branch photos
│   └── src/
│       ├── components/      # Modular UI components (SearchBar, Nav, Footer, Modal)
│       ├── hooks/           # Custom React hooks (useBranchContact, etc.)
│       ├── pages/           # Views (Home, BuyCar, CarDetail, Admin, Auth)
│       ├── utils/           # Axios instance & formatters
│       ├── App.jsx          # Router & Route guards
│       └── main.jsx         # Application entry
│
├── LICENSE                  # MIT Open Source License
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

## 👨‍💻 Author

**Cao Cường (justccuong)**  
- GitHub: [@justccuong](https://github.com/justccuong)  
- Portfolio / Live Project: [kiencuongauto.vn](https://kiencuongauto.vn)
