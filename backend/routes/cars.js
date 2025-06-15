const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const Car = require('../models/Car');
const upload = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// POST: Thêm ô tô mới (admin only)
router.post(
  '/',
  isAuthenticated, 
  isAdmin, 
  upload.array('images', 11),
  async (req, res) => {
    try {
      const imageUrls = req.files.map(file => file.path);
      const newCar = new Car({ ...req.body, images: imageUrls });
      await newCar.save();
      res.status(201).json({ message: 'Thêm ô tô thành công!', car: newCar });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server khi thêm ô tô.' });
    }
  }
);

// PUT: Sửa thông tin ô tô (admin only)
router.put(
  '/:id',
  isAuthenticated, 
  isAdmin, 
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    try {
      const updatedCar = await Car.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });

      if (!updatedCar) {
        return res.status(404).json({ message: "Không tìm thấy ô tô" });
      }

      res.status(200).json({ message: "Cập nhật thành công", car: updatedCar });
    } catch (err) {
      console.error("❌ Error updating car:", err);
      res.status(500).json({ message: "Lỗi server khi cập nhật" });
    }
  }
);

// DELETE: Xoá ô tô (admin only)
router.delete(
  '/:id',
  isAuthenticated, 
  isAdmin, 
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    try {
      const deletedCar = await Car.findByIdAndDelete(id);
      if (!deletedCar) {
        return res.status(404).json({ message: "Không tìm thấy ô tô để xoá" });
      }

      res.status(200).json({ message: "Xoá thành công", car: deletedCar });
    } catch (err) {
      console.error("❌ Error deleting car:", err);
      res.status(500).json({ message: "Lỗi server khi xoá ô tô" });
    }
  }
);

// GET: Lấy toàn bộ xe
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error("❌ Error getting cars:", err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ô tô.' });
  }
});

// GET: Lấy chi tiết xe
router.get('/detail/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: true, message: "ID không hợp lệ" });
  }

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ error: true, message: "Không tìm thấy ô tô" });
    }

    res.status(200).json({ car: { ...car.toObject() } });
  } catch (error) {
    console.error("❌ Error getting car detail:", error);
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;
