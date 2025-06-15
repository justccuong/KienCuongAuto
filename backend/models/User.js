const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },         
  phone: {
  type: String,
  required: true,
  match: [/^0\d{9,10}$/, "Số điện thoại không hợp lệ"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  }, 
  password: { type: String, required: true },     
  role: {
    type: String,
    enum: ['user', 'admin'],                      
    default: 'user'                              
  }
});

module.exports = mongoose.model('User', userSchema);
