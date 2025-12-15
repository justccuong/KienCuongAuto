// backend/test-discord.js
require('dotenv').config(); // Load biến môi trường .env
const sendDiscord = require('./utils/discordLogger'); // Trỏ đúng file logger của b

console.log("🚀 Đang test gửi Discord...");
console.log("Webhook URL:", process.env.DISCORD_WEBHOOK_URL ? "Đã có" : "❌ CHƯA CÓ TRONG .ENV");

const fakeError = {
    message: "Test thử xem Discord có nổ không?",
    route: "TEST_SCRIPT",
    status: 500,
    stack: "Lỗi giả lập để test webhook"
};

sendDiscord(fakeError);