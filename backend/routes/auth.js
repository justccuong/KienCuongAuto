const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require('../middleware/verifyToken');

const clean = (val) => (val ? String(val) : "");

router.post("/register", async (req, res) => {

  const name = clean(req.body.name);
  const phone = clean(req.body.phone);
  const email = clean(req.body.email);
  const password = clean(req.body.password);
  

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: "user" 
    });

    await newUser.save();

    res.status(201).json({ msg: "Tạo tài khoản thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký:", err);
    res.status(500).json({ msg: "Lỗi server khi tạo tài khoản" });
  }
});

router.post("/login", async (req, res) => {
  const email = clean(req.body.email); 
  const password = clean(req.body.password);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email không đúng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔒 FIX: Cấu hình Cookie chuẩn cho Production (HTTPS)
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    res.status(500).json({ msg: "Lỗi server khi đăng nhập" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy thông tin user" });
  }
});

router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ msg: "Đăng xuất thành công" });
});

router.put("/me", verifyToken, async (req, res) => {
  try {
    const name = clean(req.body.name);
    const phone = clean(req.body.phone);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Không tìm thấy người dùng" });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      msg: "Cập nhật thông tin thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật thông tin:", err);
    res.status(500).json({ msg: "Lỗi server khi cập nhật thông tin cá nhân" });
  }
});

module.exports = router;