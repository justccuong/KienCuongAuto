const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,
  year: Number,
  kilometers: String,
  manufacturer: String,
  branch: String,
  type: String,
  fuel: String,
  price: String,
  status: String,
  brand: String,
  color: String,
  drive: String,
  gearbox: String,
  condition: String,
  doors: Number,
  seats: Number,
  engineCapacity: String,
  installment: String,
  quality: String,
  images: [
    {
      url: String,
      public_id: String,
    }
  ],
 
});

module.exports = mongoose.model('Car', carSchema);
