const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const helmet = require("helmet");
const compression = require("compression");

app.use(helmet());
app.use(compression());

app.use(cookieParser());

const allowedOrigins = [
  "https://kiencuongauto.vn",
  "https://www.kiencuongauto.vn",
  "http://kiencuongauto.vn",
  "http://www.kiencuongauto.vn",
  //local
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


app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection error:", err));

const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars"); 
const branchRoutes = require("./routes/branchRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes); 
app.use("/api/branches", branchRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

