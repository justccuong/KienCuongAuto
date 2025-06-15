const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, ... }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { verifyToken };
