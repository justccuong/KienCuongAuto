const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",  // domain FE
  credentials: true,                // cho phép gửi cookie
}));

app.use(express.json()); // Parse JSON body

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars"); // 👈 Thêm dòng này!

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes); // ✅ Giờ thì không lỗi nữa

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
