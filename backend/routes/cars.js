const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Car = require('../models/Car');
const upload = require('../middleware/upload');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');

router.get('/', async (req, res) => {
  try {
    const getStringParam = (val) => {
      if (!val) return undefined;
      return String(val); 
    };

    const name = getStringParam(req.query.name);
    const branch = getStringParam(req.query.branch);
    const status = getStringParam(req.query.status);
    const color = getStringParam(req.query.color);
    const drive = getStringParam(req.query.drive);
    const gearbox = getStringParam(req.query.gearbox);
    const condition = getStringParam(req.query.condition);
    const fuel = getStringParam(req.query.fuel);
    const manufacturer = getStringParam(req.query.manufacturer);
    const installment = getStringParam(req.query.installment);
    const quality = getStringParam(req.query.quality);

    let query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    const addQuery = (key, value) => {
      if (value) {
        query[key] = new RegExp(`^${value}$`, "i");
      }
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