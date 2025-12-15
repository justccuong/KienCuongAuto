// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit'); // 1. Đổi import thành require

// 2. Limiter chung cho toàn bộ ứng dụng
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 phút
    max: 300, // Tối đa 100 request mỗi IP
    message: {
        status: 429,
        error: "Gửi request nhiều quá! Nghỉ ngơi 15 phút nhé.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Limiter gắt hơn cho Auth (Login, Register...)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 tiếng
    max: 10, // Cho phép sai 10 lần/tiếng (nới lỏng chút cho đỡ căng)
    message: {
        status: 429,
        error: "Đăng nhập sai quá nhiều! Tài khoản bị khóa tạm thời trong 1 giờ.",
    },
});

// 4. Xuất module theo kiểu CommonJS
module.exports = { globalLimiter, authLimiter };