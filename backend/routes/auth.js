const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyToken } = require('../middleware/verifyToken');


// =================== ĐĂNG KÝ ===================
router.post("/register", async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  try {
    // ✅ Kiểm tra email đã tồn tại chưa
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    // ✅ Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Tạo user mới
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role || "user" // hoặc có thể hardcode luôn: role: "user"
    });

    await newUser.save();

    res.status(201).json({ msg: "Tạo tài khoản thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký:", err);
    res.status(500).json({ msg: "Lỗi server khi tạo tài khoản" });
  }
});

// =================== ĐĂNG NHẬP ===================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email không đúng" });

    // ✅ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

    // ✅ Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",     // hoặc "none" nếu dùng HTTPS
      secure: false       // true nếu dùng HTTPS
    });

    // ✅ Trả về token + user info (không gồm mật khẩu)
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
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy thông tin user" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",  // hoặc "none" nếu đang xài HTTPS
    secure: false     // đổi sang true nếu dùng HTTPS
  });
  res.status(200).json({ msg: "Đăng xuất thành công" });
});
module.exports = router;
