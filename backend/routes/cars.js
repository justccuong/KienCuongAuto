const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const Car = require('../models/Car');
const upload = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');

router.post(
  '/',
  isAuthenticated,
  isAdmin,
  upload.array('images', 11),
  async (req, res) => {
    try {
      const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename, 
      }));

      const newCar = new Car({
        ...req.body,
        images: images, 
      });

      await newCar.save();
      res.status(201).json({ message: 'Thêm ô tô thành công!', car: newCar });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server khi thêm ô tô.' });
    }
  }
);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  upload.none(), 
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    try {
      const updatedCar = await Car.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
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
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).json({ message: "Không tìm thấy ô tô để xoá" });
      }

      for (const img of car.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id); 
          } catch (cloudErr) {
            console.error("❌ Lỗi xoá ảnh:", cloudErr);
          }
        }
      }

      await car.deleteOne();

      res.status(200).json({ message: "Xoá thành công", car });
    } catch (err) {
      console.error("❌ Error deleting car:", err);
      res.status(500).json({ message: "Lỗi server khi xoá ô tô" });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const {
      name, 
      branch,
      status,
      color,
      drive,
      gearbox,
      condition,
      fuel,
      manufacturer,
      installment,
      quality,
    } = req.query;

    let query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    const addQuery = (key, value) => {
      if (value) query[key] = new RegExp(`^${value}$`, "i");
    };

    addQuery("branch", branch);
    addQuery("status", status);
    addQuery("color", color);
    addQuery("drive", drive);
    addQuery("gearbox", gearbox);
    addQuery("condition", condition);
    addQuery("fuel", fuel);
    addQuery("manufacturer", manufacturer);
    addQuery("installment", installment);
    addQuery("quality", quality);

    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    console.error("❌ Error getting cars:", err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ô tô.' });
  }
});

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

