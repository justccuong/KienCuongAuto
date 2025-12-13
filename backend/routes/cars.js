const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Car = require('../models/Car');
const upload = require('../middlewares/upload');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const cloudinary = require('../utils/cloudinary');

// 🛡️ HÀM HELPER: Escape Regex (Chống hack ReDoS)
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// ==========================================
// 1. ADMIN: THÊM XE MỚI
// ==========================================
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

// ==========================================
// 2. ADMIN: SỬA XE
// ==========================================
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

// ==========================================
// 3. ADMIN: XÓA XE
// ==========================================
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

      // Xóa ảnh trên Cloudinary
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

// ==========================================
// 4. PUBLIC: LẤY DANH SÁCH XE (ĐÃ NÂNG CẤP LỌC & BẢO MẬT)
// ==========================================
router.get('/', async (req, res) => {
  try {
    // A. DANH SÁCH TRẮNG (Chỉ cho phép những tham số này đi qua)
    const allowedParams = [
      'name', 'minPrice', 'maxPrice', // Lọc cơ bản
      'branch', 'status', 'color', 'drive', 
      'gearbox', 'condition', 'fuel', 'manufacturer', 
      'installment', 'quality'
    ];

    // B. KIỂM TRA THAM SỐ LẠ (Chống Hack)
    const queryKeys = Object.keys(req.query);
    const hasStrangeParam = queryKeys.some(key => !allowedParams.includes(key));

    if (hasStrangeParam) {
      console.log("🚫 [Security] Chặn tham số lạ:", req.query);
      return res.json([]); // Trả về rỗng ngay
    }

    // C. HÀM ÉP KIỂU STRING (Chống NoSQL Injection)
    const getStringParam = (val) => {
      if (!val) return undefined;
      return String(val); 
    };

    // Lấy dữ liệu từ Query URL
    const name = getStringParam(req.query.name);
    const minPrice = getStringParam(req.query.minPrice);
    const maxPrice = getStringParam(req.query.maxPrice);

    // --- TẠO QUERY MONGO DB ---
    let query = {};

    // 1. Tìm theo tên (Dùng escapeRegex để an toàn)
    if (name) {
      query.name = new RegExp(escapeRegex(name), "i");
    }

    // 2. Tìm theo giá (Khoảng giá min-max)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        // Chuyển về số để so sánh (Backend lưu price là số hoặc chuỗi số đều OK với Mongo)
        // Lưu ý: Nếu DB lưu price là String thì cần đảm bảo convert đúng, 
        // nhưng tốt nhất DB nên lưu price là Number.
        query.price.$gte = Number(minPrice); 
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 3. Tìm chính xác các thuộc tính khác (Dropdown)
    const addExactQuery = (key, value) => {
      if (value) {
        // Tìm chính xác (Case-insensitive) bắt đầu bằng ^ và kết thúc bằng $
        query[key] = new RegExp(`^${escapeRegex(value)}$`, "i");
      }
    };

    // Áp dụng cho danh sách các bộ lọc
    addExactQuery("branch", getStringParam(req.query.branch));
    addExactQuery("status", getStringParam(req.query.status));
    addExactQuery("color", getStringParam(req.query.color));
    addExactQuery("drive", getStringParam(req.query.drive));
    addExactQuery("gearbox", getStringParam(req.query.gearbox));
    addExactQuery("condition", getStringParam(req.query.condition));
    addExactQuery("fuel", getStringParam(req.query.fuel));
    addExactQuery("manufacturer", getStringParam(req.query.manufacturer));
    addExactQuery("installment", getStringParam(req.query.installment));
    addExactQuery("quality", getStringParam(req.query.quality));

    // Thực thi
    // console.log("🔍 Final Query:", JSON.stringify(query));
    const cars = await Car.find(query).sort({ _id: -1 }); // Mới nhất lên đầu
    res.json(cars);

  } catch (err) {
    console.error("❌ Error getting cars:", err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ô tô.' });
  }
});

// ==========================================
// 5. PUBLIC: CHI TIẾT XE
// ==========================================
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