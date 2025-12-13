const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const { globalLimiter, authLimiter } = require('./middlewares/rateLimiter');

const app = express();

// --- MIDDLEWARES CƠ BẢN ---
app.use(helmet());
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
    // Cho phép requests không có origin (như Postman) hoặc nằm trong whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// --- 2. QUAN TRỌNG: RATE LIMIT PHẢI ĐẶT Ở ĐÂY ---
// Đặt trước tất cả các routes để chặn ngay từ cửa
app.use(globalLimiter);

// --- KẾT NỐI MONGODB ---
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true, // Mấy dòng này Mongoose mới tự động rồi, có thể bỏ cho đỡ warning
  // useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection error:", err));

// --- ROUTES ---
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const branchRoutes = require("./routes/branchRoutes");
// const productRoutes = require("./routes/products"); // <--- Mở comment nếu có file này

// Áp dụng routes
app.use("/api/auth", authRoutes); // Auth limiter nên gắn trực tiếp trong file routes/auth.js nhé
app.use("/api/cars", carRoutes);
app.use("/api/branches", branchRoutes);
// app.use('/api/products', productRoutes); // <--- Mở comment nếu có file này

// --- STATIC FILES (FRONTEND) ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Test route
app.get('/api/health', (req, res) => res.send('Server sống nhăn!'));

app.get("/{*any}", (req, res)=> {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));