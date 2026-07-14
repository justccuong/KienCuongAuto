// backend/routes/analytics.js
const router = require("express").Router();
const Visit = require("../models/Visit"); 
const Car = require("../models/Car");
const GlobalStat = require("../models/GlobalStat"); // ⭐ MUST HAVE THIS MODEL

// Hàm tiện ích: Lấy slug từ URL
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
        const topCars = await Car.find({ views: { $gt: 0 } })
            .sort({ views: -1 })
            .limit(5)
            .select('name slug images views price');

        if (!topCars || topCars.length === 0) {
            return res.json([]);
        }

        const formattedData = topCars.map(car => ({
            _id: car._id,
            carName: car.name,
            slug: car.slug,
            carImage: car.images?.[0]?.url || car.images?.[0] || 'https://via.placeholder.com/100?text=Car',
            count: car.views || 0,
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

// ==========================================
// 2. API: Track visits (CHỈ ĐẾM SESSION MỚI)
// ==========================================
router.post("/track", async (req, res) => {
    try {
        const { page, referrer, userAgent, isNewSession } = req.body;

        if (!page) return res.status(400).json({ error: 'Page URL required' });

        // Bỏ qua admin
        if (page.includes('/admin') || page.includes('/dashboard')) {
            return res.status(200).json({ message: 'Ignored' });
        }

        // 1. CỘNG VIEW XE (Mỗi lần xem)
        if (page.includes('/cars/')) {
            const slugOrId = extractCarSlug(page);
            if (slugOrId) {
                const query = isValidObjectId(slugOrId) 
                    ? { $or: [{ slug: slugOrId }, { _id: slugOrId }] }
                    : { slug: slugOrId };
                
                await Car.findOneAndUpdate(query, { $inc: { views: 1 } }).catch(e => console.error(e));
            }
        }

        // 2. CHỈ LƯU VISIT KHI LÀ SESSION MỚI
        if (isNewSession) {
            // Cộng GlobalStat
            await GlobalStat.findOneAndUpdate(
                {}, 
                { $inc: { totalVisits: 1 }, $set: { lastUpdated: new Date() } }, 
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            
            // Lưu Visit log (để vẽ biểu đồ theo ngày)
            await Visit.create({
                page, 
                referrer: referrer || '', 
                userAgent: userAgent || '', 
                timestamp: new Date()
            });
            
            console.log("🚀 New session - Visit +1");
        } else {
            console.log("👻 Same session - No tracking");
        }

        res.status(201).json({ success: true });

    } catch (err) {
        console.error("❌ Lỗi tracking:", err);
        res.status(500).json({ error: 'Failed', message: err.message });
    }
});

// ==========================================
// 3. API: Lấy VISITS theo ngày (cho biểu đồ)
// ==========================================
router.get("/stats", async (req, res) => {
    try {
        // Bây giờ Visit chỉ lưu khi isNewSession = true
        // Nên đây là số lượt truy cập (sessions) theo ngày
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
            { $sort: { _id: 1 } },
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
router.get("/overview", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // ⭐ LẤY HOẶC TẠO GLOBAL STAT
        let globalStat = await GlobalStat.findOne({});
        
        // Nếu chưa có, tạo mới
        if (!globalStat) {
            globalStat = await GlobalStat.create({ 
                totalVisits: 0, 
                lastUpdated: new Date() 
            });
            console.log("📊 Created new GlobalStat document");
        }

        const [totalCars, totalViewsArray, todayVisits] = await Promise.all([
            // Tổng số xe
            Car.countDocuments(),
            
            // Tổng views của xe
            Car.aggregate([
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]),
            
            // Visits hôm nay (từ Visit collection)
            Visit.countDocuments({ 
                createdAt: { $gte: today } 
            })
        ]);

        const totalViews = totalViewsArray[0]?.total || 0;

        const responseData = {
            totalVisits: globalStat.totalVisits || 0, // Unique sessions (từ GlobalStat)
            totalCars: totalCars || 0,
            totalViews: totalViews, // Total car views
            todayVisits: todayVisits || 0 // Visits hôm nay
        };

        console.log("📊 Overview data:", responseData);
        res.json(responseData);

    } catch (err) {
        console.error("❌ Lỗi lấy overview:", err);
        res.status(500).json({ 
            error: 'Không thể lấu dữ liệu tổng quan',
            message: err.message 
        });
    }
});

module.exports = router;