const mongoose = require('mongoose');

const globalStatSchema = new mongoose.Schema({
  // Đây là biến quan trọng nhất: Tổng lượt truy cập trọn đời
  totalVisits: { 
    type: Number, 
    default: 0 
  },
  // Nếu muốn sau này đếm thêm cái gì trọn đời thì thêm vào đây
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('GlobalStat', globalStatSchema);