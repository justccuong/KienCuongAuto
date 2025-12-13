const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require('../middlewares/verifyToken');

// 1. FIX: Thêm trim() để cắt khoảng trắng thừa
const clean = (val) => (val ? String(val).trim() : "");

// Cấu hình Cookie chung để dùng lại cho đồng bộ (DRY)
const getCookieConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: '/', // 3. FIX: Quan trọng để tránh lỗi cookie trùng path
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    };
};

router.post("/register", async (req, res) => {
  try {
    const name = clean(req.body.name);
    const phone = clean(req.body.phone);
    const email = clean(req.body.email);
    const password = clean(req.body.password);

    // 4. FIX: Validate cơ bản
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: "Mật khẩu phải từ 6 ký tự trở lên" });
    }

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
  try {
    const email = clean(req.body.email); 
    const password = clean(req.body.password);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email không đúng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set Cookie
    res.cookie("token", token, getCookieConfig());

    // 2. FIX: KHÔNG trả token về JSON nữa.
    // Chỉ trả user info. Frontend tự hiểu là login thành công nếu status 200.
    res.status(200).json({
      msg: "Đăng nhập thành công",
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
  // Clear cookie phải giống hệt options lúc tạo (trừ maxAge)
  const cookieConfig = getCookieConfig();
  
  res.clearCookie("token", {
      httpOnly: true,
      sameSite: cookieConfig.sameSite,
      secure: cookieConfig.secure,
      path: '/' // Phải có path
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