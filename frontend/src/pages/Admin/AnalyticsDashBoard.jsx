import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from "recharts";
import { Users, Eye, Car, TrendingUp, Calendar, Loader2 } from "lucide-react"; 
import { useAuth } from "../../context/AuthContext"; 
import OptimizedImage from "../../components/input/OptimizedImage";

// --- KHAI BÁO DỮ LIỆU CỨNG MẶC ĐỊNH CHO KPI ---
const INITIAL_KPI = {
  totalVisits: 'N/A', 
  totalCarViews: 'N/A', // Changed from pageViews
  carCount: 'N/A', 
  conversionRate: 'N/A'
};

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [kpis, setKpis] = useState(INITIAL_KPI);
  const [loading, setLoading] = useState(true);

  // Tính toán Tên chào mừng (Personalized Greeting)
  const greetingName = useMemo(() => {
    return user?.name ? user.name : "Hoàng tử"; 
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // GỌI ĐỒNG THỜI TẤT CẢ API CẦN THIẾT (THÊM /overview)
        const [statsRes, topCarsRes, overviewRes] = await Promise.all([
          axios.get("/api/analytics/stats"), 
          axios.get("/api/analytics/top-cars"),
          axios.get("/api/analytics/overview"), // NEW: Get overview data
        ]);

        // 1. XỬ LÝ BIỂU ĐỒ (STATS)
        if (statsRes.data && Array.isArray(statsRes.data) && statsRes.data.length > 0) {
             const formatted = statsRes.data.map(item => {
                const dateStr = item._id || ''; // Ví dụ: "2025-12-14"
                const dateParts = dateStr.split('-');
                
                // Hiển thị: 12/14
                const displayName = dateParts.length >= 3 
                    ? `${dateParts[1]}/${dateParts[2]}` 
                    : dateStr;
                
                return {
                    originalDate: dateStr, // Giữ lại ngày gốc (YYYY-MM-DD) để sắp xếp
                    name: displayName,
                    visits: item.count || 0
                };
             })
             // 👇 PHÉP THUẬT Ở ĐÂY: Sắp xếp A->Z theo ngày gốc (Cũ trước - Mới sau)
             .sort((a, b) => a.originalDate.localeCompare(b.originalDate));
             
             setStats(formatted);
        } else {
             setStats([]); 
        }
        
        // 2. XỬ LÝ TOP CARS - Backend đã trả về carName và carImage
        if (topCarsRes && Array.isArray(topCarsRes.data)) {
           setTopCars(topCarsRes.data);
        } else {
           setTopCars([]);
        }

        // 3. XỬ LÝ KPI (Từ API /overview)
        const overview = overviewRes.data || {};
        
        // Tính tỷ lệ quan tâm (Conversion Rate)
        // Công thức: (Tổng views xe / Tổng lượt truy cập) × 100
        const conversionRate = overview.totalVisits > 0 
                             ? ((overview.totalViews / overview.totalVisits) * 100).toFixed(1)
                             : '0.0';

        setKpis({
            totalVisits: overview.totalVisits?.toLocaleString('en-US') || 'N/A',
            totalCarViews: overview.totalViews?.toLocaleString('en-US') || 'N/A', // Real total from Car.views
            carCount: overview.totalCars?.toLocaleString('en-US') || 'N/A',
            conversionRate: `${conversionRate}%`,
        });

      } catch (err) {
        console.error("Lỗi lấy dữ liệu Dashboard:", err);
        setStats([]);
        setTopCars([]);
        setKpis(INITIAL_KPI); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  // Component thẻ thống kê nhỏ (Widget)
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  if (loading) return (
    <div className="p-10 text-center flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" /> 
        <span className="text-gray-600">Đang tải dữ liệu thần thánh...</span>
    </div>
  );

  return (
    <div className="p-6">
      {/* 1. Header chào mừng */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Xin chào, {greetingName}! 👑</h1>
          <p className="text-gray-500 mt-1">Đây là tình hình kinh doanh của vương quốc xe hơi.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Calendar className="w-4 h-4" /> 30 ngày qua
        </button>
      </div>

      {/* 2. Các thẻ chỉ số quan trọng (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng lượt truy cập" 
          value={kpis.totalVisits} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Tổng lượt xem xe" 
          value={kpis.totalCarViews} 
          icon={Eye} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Xe đang bán" 
          value={kpis.carCount} 
          icon={Car} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Tỷ lệ quan tâm" 
          value={kpis.conversionRate} 
          icon={TrendingUp} 
          color="bg-pink-500" 
        />
      </div>

      {/* 3. Biểu đồ chính (Main Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: Biểu đồ đường (Line/Area Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Xu hướng truy cập</h3>
          <div className="h-[300px]">
            {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="visits" name="Lượt truy cập" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 italic">Chưa có dữ liệu truy cập để hiển thị biểu đồ.</div>
            )}
          </div>
        </div>

        {/* Cột phải: Top xe quan tâm (List) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top xe được xem nhiều 🏎️</h3>
          <div className="space-y-4">
            {topCars.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Chưa có lượt xem trang xe nào được ghi nhận.</p>
            ) : (
                topCars.map((item, index) => (
                    <div 
                        key={item._id || index} 
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition"
                    >
                        {/* Ảnh xe */}
                        <div className="w-14 h-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            {item.carImage && item.carImage !== 'default_url' ? (
                                <OptimizedImage
                                    src={item.carImage}
                                    alt={item.carName || "Xe hơi"}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                    🚗
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Tên xe - Backend đã trả về carName */}
                            <h4 className="font-semibold text-gray-800 text-sm truncate" title={item.carName || 'Không có tên'}>
                                {item.carName || 'Xe không xác định'}
                            </h4>
                            <p className="text-gray-400 text-xs">{item.count} lượt xem</p>
                        </div>
                        
                        {/* Box thứ tự */}
                        <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg 
                             ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                               index === 1 ? 'bg-gray-100 text-gray-600' : 
                               index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                            {index + 1}
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;