const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.cookie("token", token, {
  httpOnly: true,     // Không đọc được bằng JS
  secure: true,       // Chỉ gửi qua HTTPS (trên production)
  sameSite: "strict", // Chống CSRF
  maxAge: 86400000,   // 1 ngày
}).json({ message: "Login success" });