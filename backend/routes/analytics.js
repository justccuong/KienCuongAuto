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

// API: Lấy danh sách Top Xe được xem nhiều nhất
router.get("/top-cars", async (req, res) => {
    try {
        // 1. Aggregate để nhóm và đếm lượt xem theo trang xe
        const topCarsData = await Visit.aggregate([
            { 
                $match: { 
                    page: { $regex: /^\/cars\//i } 
                } 
            },
            {
                $group: {
                    _id: "$page",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Kiểm tra nếu không có dữ liệu
        if (!topCarsData || topCarsData.length === 0) {
            return res.json([]);
        }

        // 2. Trích xuất slugs hoặc IDs từ URLs
        const slugsOrIds = topCarsData
            .map(item => extractCarSlug(item._id))
            .filter(slug => slug);

        // Kiểm tra xem có phải ObjectID không (24 ký tự hex)
        const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);
        const objectIds = slugsOrIds.filter(isObjectId);
        const slugs = slugsOrIds.filter(s => !isObjectId(s));

        // 3. Tìm thông tin xe theo BOTH slugs AND ObjectIDs
        let carDetails = [];
        
        if (objectIds.length > 0) {
            const carsByIds = await Car.find({ 
                _id: { $in: objectIds } 
            }).select('_id name slug images');
            carDetails = carDetails.concat(carsByIds);
        }
        
        if (slugs.length > 0) {
            const carsBySlugs = await Car.find({ 
                slug: { $in: slugs } 
            }).select('_id name slug images');
            carDetails = carDetails.concat(carsBySlugs);
        }

        // Tạo Map để tra cứu nhanh (theo CẢ slug VÀ _id)
        const carMap = new Map();
        carDetails.forEach(car => {
            carMap.set(car.slug, car);
            carMap.set(car._id.toString(), car);
        });

        // 4. Kết hợp dữ liệu
        const finalTopCars = topCarsData.map(item => {
            const slug = extractCarSlug(item._id);
            const carDetail = carMap.get(slug);
            
            // DEBUG: Log để kiểm tra
            console.log('Processing car:', {
                pageUrl: item._id,
                extractedSlug: slug,
                foundCar: carDetail?.name || 'NOT FOUND',
                count: item.count
            });
            
            // Tạo tên hiển thị từ slug nếu không tìm thấy car
            const displayName = carDetail?.name || 
                                (slug ? slug.split('-')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ') : null) ||
                                'Xe không xác định';
            
            // Lấy ảnh đầu tiên hoặc ảnh placeholder
            const displayImage = carDetail?.images?.[0]?.url || 
                                carDetail?.images?.[0] || // Trường hợp images là mảng string
                                'https://via.placeholder.com/100?text=Car';

            return {
                _id: carDetail?._id || item._id, // Dùng car _id thay vì page URL
                count: item.count,
                slug: slug,
                carName: displayName,
                carImage: displayImage
            };
        });

        res.json(finalTopCars);

    } catch (err) {
        console.error("❌ Lỗi lấy top cars:", err);
        res.status(500).json({ 
            error: 'Không thể lấy dữ liệu top cars',
            message: err.message 
        });
    }
});

// API: Track page visits (POST endpoint)
router.post("/track", async (req, res) => {
    try {
        const { page, referrer, userAgent } = req.body;

        // Validate required field
        if (!page) {
            return res.status(400).json({ 
                error: 'Page URL is required' 
            });
        }

        // Bỏ qua tracking cho trang admin/dashboard
        if (page.includes('/admin') || page.includes('/dashboard')) {
            return res.status(200).json({ 
                message: 'Admin page tracking ignored' 
            });
        }

        // Tạo visit record
        const visit = await Visit.create({
            page,
            referrer: referrer || '',
            userAgent: userAgent || req.get('user-agent') || '',
            timestamp: new Date()
        });

        res.status(201).json({ 
            success: true,
            visitId: visit._id 
        });

    } catch (err) {
        console.error("❌ Lỗi tracking visit:", err);
        res.status(500).json({ 
            error: 'Failed to track visit',
            message: err.message 
        });
    }
});

// API: Lấy thống kê lượt truy cập theo ngày
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
            { $sort: { _id: -1 } },
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

module.exports = router;