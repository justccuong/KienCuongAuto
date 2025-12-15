// backend/routes/analytics.js
const router = require("express").Router();
const Visit = require("../models/Visit"); 
const Car = require("../models/Car");

// Hàm tiện ích: Lấy slug từ URL (Ví dụ: /cars/mercedes-g63-abc -> mercedes-g63-abc)
const extractCarSlug = (pageUrl) => {
    if (!pageUrl || typeof pageUrl !== 'string') return '';
    const parts = pageUrl.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
};

// Hàm kiểm tra ObjectId hợp lệ
const isValidObjectId = (str) => {
    return /^[0-9a-fA-F]{24}$/.test(str);
};

// ==========================================
// 1. API: Lấy Top Xe (Sử dụng Car.views)
// ==========================================
router.get("/top-cars", async (req, res) => {
    try {
        // Query trực tiếp từ bảng Car theo views
        const topCars = await Car.find({ views: { $gt: 0 } }) // Chỉ lấy xe có view > 0
            .sort({ views: -1 }) // Sắp xếp giảm dần (cao nhất đứng đầu)
            .limit(5) // Lấy top 5 xe
            .select('name slug images views price'); // Chỉ lấy trường cần thiết

        // Kiểm tra nếu không có dữ liệu
        if (!topCars || topCars.length === 0) {
            return res.json([]);
        }

        // Format lại dữ liệu cho khớp với Frontend
        const formattedData = topCars.map(car => ({
            _id: car._id,
            carName: car.name,
            slug: car.slug,
            // Lấy ảnh đầu tiên, fallback nếu không có
            carImage: car.images?.[0]?.url || car.images?.[0] || 'https://via.placeholder.com/100?text=Car',
            count: car.views || 0, // Frontend dùng 'count', ta map 'views' sang
            price: car.price
        }));

        console.log('✅ Top cars loaded:', formattedData.length);

        res.json(formattedData);

    } catch (err) {
        console.error("❌ Lỗi lấy top cars:", err);
        res.status(500).json({ 
            error: 'Không thể lấy dữ liệu top cars',
            message: err.message 
        });
    }
});

router.post("/track", async (req, res) => {
    try {
        // 👇 Lấy thêm biến isNewSession từ Frontend gửi lên
        const { page, referrer, userAgent, isNewSession } = req.body;

        if (!page) return res.status(400).json({ error: 'Page URL required' });

        // Bỏ qua admin
        if (page.includes('/admin') || page.includes('/dashboard')) {
            return res.status(200).json({ message: 'Ignored' });
        }

        // 1. CỘNG VIEW XE (Vẫn cộng mỗi lần bấm vào, để xe nhìn hot)
        if (page.includes('/cars/')) {
            const slugOrId = extractCarSlug(page);
            if (slugOrId) {
                const query = isValidObjectId(slugOrId) 
                    ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
                    : { slug: slugOrId };
                
                await Car.findOneAndUpdate(query, { $inc: { views: 1 } }).catch(e => console.error(e));
            }
        }

        // 2. CỘNG TỔNG TRUY CẬP (GLOBAL STAT)
        // 🔥 CHỈ CỘNG KHI LÀ PHIÊN MỚI (isNewSession = true)
        if (isNewSession) {
            await GlobalStat.findOneAndUpdate(
                {}, 
                { $inc: { totalVisits: 1 }, $set: { lastUpdated: new Date() } }, 
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            // console.log("🚀 Khách mới - Đã +1 Visit");
        } else {
            // console.log("👻 Khách cũ đang lướt - Không cộng Visit");
        }

        // 3. LƯU LOG CHI TIẾT
        // Vẫn lưu log để vẽ biểu đồ "Hoạt động trong ngày".
        // (Nếu Hoàng tử muốn biểu đồ cũng chỉ hiện Visit thì bọc cái này vào if (isNewSession) luôn)
        // Nhưng thường biểu đồ nên hiện Pageview (nhảy nhót nhiều) cho đẹp.
        await Visit.create({
            page, 
            referrer: referrer || '', 
            userAgent: userAgent || '', 
            timestamp: new Date()
        });

        res.status(201).json({ success: true });

    } catch (err) {
        console.error("❌ Lỗi tracking:", err);
        res.status(500).json({ error: 'Failed' });
    }
});

// ==========================================
// 3. API: Lấy thống kê lượt truy cập theo ngày
// ==========================================
router.get("/stats", async (req, res) => {
    try {
        const stats = await Visit.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$createdAt" 
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }, // Sort tăng dần để vẽ biểu đồ từ trái qua phải
            { $limit: 30 }
        ]);

        res.json(stats);
    } catch (err) {
        console.error("❌ Lỗi lấy stats:", err);
        res.status(500).json({ 
            error: 'Không thể lấy dữ liệu thống kê',
            message: err.message 
        });
    }
});

// ==========================================
// 4. API: Tổng quan thống kê Dashboard
// ==========================================
// URL: GET /api/analytics/overview
// Mục đích: Hiển thị các số liệu tổng quan cho trang Admin Dashboard
router.get("/overview", async (req, res) => {
    try {
        // Lấy ngày hôm nay (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalVisits, totalCars, totalViews, todayVisits] = await Promise.all([
            // Tổng lượt visit (30 ngày do TTL index)
            Visit.countDocuments(),
            
            // Tổng số xe
            Car.countDocuments(),
            
            // Tổng views của tất cả xe (từ Car.views)
            Car.aggregate([
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]),
            
            // Lượt visit hôm nay
            Visit.countDocuments({ 
                createdAt: { $gte: today } 
            })
        ]);

        res.json({
            totalVisits,
            totalCars,
            totalViews: totalViews[0]?.total || 0,
            todayVisits
        });
    } catch (err) {
        console.error("❌ Lỗi lấy overview:", err);
        res.status(500).json({ 
            error: 'Không thể lấy dữ liệu tổng quan',
            message: err.message 
        });
    }
});

module.exports = router;