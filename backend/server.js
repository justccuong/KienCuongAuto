const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

// Sửa lại import: Bỏ analyticsRoutes ở đây cho đỡ trùng ở dưới
const { globalLimiter, authLimiter } = require('./middlewares/rateLimiter');
// const verifyToken = require('./middlewares/verifyToken'); // Cái này chưa dùng ở file này, có thể comment lại

const app = express();

// --- MIDDLEWARES CƠ BẢN ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://static.cloudflareinsights.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
    },
  },
}));
app.use(compression());
app.set('trust proxy', 1); 
app.use(cookieParser());
app.use(express.json());

// --- CẤU HÌNH CORS ---
const allowedOrigins = [
  "https://kiencuongauto.vn",
  "https://www.kiencuongauto.vn",
  "http://kiencuongauto.vn",
  "http://www.kiencuongauto.vn",
  "http://localhost:5000",
  "http://localhost:4173",
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// --- RATE LIMIT ---
app.use(globalLimiter);

// --- KẾT NỐI MONGODB ---
// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log("✅ MongoDB connected"))
// .catch((err) => console.error("❌ DB connection error:", err));

// --- ROUTES ---
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const branchRoutes = require("./routes/branchRoutes");
const analyticsRoutes = require("./routes/analytics"); // Giữ lại dòng này

// Áp dụng routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/analytics", analyticsRoutes); // 👈 QUAN TRỌNG: Phải thêm dòng này Analytics mới chạy!

// --- STATIC FILES (FRONTEND) ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Test route
app.get('/api/health', (req, res) => res.send('Server sống nhăn!'));

// Wildcard route
// Lưu ý: Nếu server báo lỗi "Missing parameter name", hãy đổi dòng dưới thành app.get("*", ...)
app.get("/{*any}", (req, res)=> {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));