// routes/branches.js
const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");

// GET /api/branches → lấy tất cả chi nhánh
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi lấy chi nhánh" });
  }
});

module.exports = router;
