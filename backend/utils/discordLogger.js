// backend/utils/discordLogger.js
const axios = require('axios');

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

const sendDiscord = async (errorData) => {
  try {
    if (!webhookUrl) return;

    // Discord cho phép gửi format đẹp (Embeds)
    const embed = {
      title: "🚨 BÁO ĐỘNG ĐỎ: SERVER GẶP LỖI!",
      color: 15158332, // Màu đỏ (Red decimal)
      fields: [
        { name: "Lỗi", value: `\`${errorData.message}\`` },
        { name: "Route", value: `\`${errorData.route}\``, inline: true },
        { name: "Status", value: `\`${errorData.status}\``, inline: true },
        { name: "Thời gian", value: new Date().toLocaleString('vi-VN') }
      ],
      footer: { text: "Kiên Cường Auto System" }
    };

    await axios.post(webhookUrl, {
      username: "Server Monitor",
      embeds: [embed]
    });

  } catch (error) {
    console.error('❌ Lỗi gửi Discord:', error.message);
  }
};

module.exports = sendDiscord;