require("dotenv").config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary').cloudinary;

// Lưu ảnh lên Cloudinary, folder "cars"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

module.exports = upload;

