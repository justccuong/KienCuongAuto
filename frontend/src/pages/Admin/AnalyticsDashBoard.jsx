import React, { useEffect, useState, useMemo } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from "recharts";
import { 
  Users, Eye, Car, TrendingUp, Calendar, Loader2, Crown, Flame, 
  Sparkles, ExternalLink, PlusCircle, ArrowUpRight, ArrowRight
} from "lucide-react"; 
import { useAuth } from "../../context/AuthContext"; 
import OptimizedImage from "../../components/input/OptimizedImage";

const INITIAL_KPI = {
  totalVisits: '0',
  totalCarViews: '0',
  carCount: '0', 
  conversionRate: '0.0%'
};

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [kpis, setKpis] = useState(INITIAL_KPI);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  const greetingName = useMemo(() => {
    return user?.name ? user.name : "Quản trị viên"; 
  }, [user]);

  // 1. Fetch tổng quan KPI & Top Cars
  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const [topCarsRes, overviewRes] = await Promise.all([
          api.get("/analytics/top-cars"),
          api.get("/analytics/overview"),
        ]);

        if (topCarsRes && Array.isArray(topCarsRes.data)) {
          setTopCars(topCarsRes.data);
        } else {
          setTopCars([]);
        }

        const overview = overviewRes.data || {};
        const totalVisits = overview.totalVisits || 0;
        const totalViews = overview.totalViews || 0;
        const totalCars = overview.totalCars || 0;
        
        const conversionRate = totalVisits > 0 
                             ? ((totalViews / totalVisits) * 100).toFixed(1)
                             : '0.0';

        setKpis({
          totalVisits: totalVisits.toLocaleString('vi-VN'), 
          totalCarViews: totalViews.toLocaleString('vi-VN'),
          carCount: totalCars.toLocaleString('vi-VN'),
          conversionRate: `${conversionRate}%`,
        });
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // 2. Fetch biểu đồ theo khoảng thời gian linh hoạt (7d, 30d, 90d, 1y)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/analytics/stats?range=${timeRange}`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map(item => {
            const dateParts = (item._id || '').split('-');
            // Format sang DD/MM (Ngày/Tháng) chuẩn Việt Nam
            const displayName = dateParts.length >= 3 
              ? `${dateParts[2]}/${dateParts[1]}` 
              : item._id;
            
            return {
              originalDate: item._id,
              name: displayName,
              visits: item.count || 0
            };
          });
          setStats(formatted);
        } else {
          setStats([]);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu biểu đồ:", err);
      }
    };

    fetchStats();
  }, [timeRange]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, iconBg }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-800">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${color} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const parts = (data.originalDate || "").split("-");
      const formattedDate = parts.length >= 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : label;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
          <p className="font-semibold text-gray-500 mb-1">Ngày {formattedDate}</p>
          <p className="text-blue-600 font-bold text-sm">
            {payload[0].value} <span className="text-xs font-normal text-gray-500">lượt truy cập</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" /> 
      <span className="text-gray-500 text-sm font-medium">Đang tải dữ liệu thống kê...</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Xin chào, {greetingName}!
            </h1>
            <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Tổng quan hoạt động kinh doanh và xu hướng khách hàng quan tâm.
          </p>
        </div>

        {/* Bộ lọc thời gian linh động */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
          {[
            { key: "7d", label: "7 ngày" },
            { key: "30d", label: "30 ngày" },
            { key: "90d", label: "3 tháng" },
            { key: "1y", label: "1 năm" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTimeRange(item.key)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === item.key
                  ? "bg-white text-blue-600 shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Tổng lượt truy cập" 
          value={kpis.totalVisits} 
          subtitle="Phiên truy cập duy nhất"
          icon={Users} 
          color="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard 
          title="Lượt xem chi tiết xe" 
          value={kpis.totalCarViews} 
          subtitle="Lượt mở trang xe"
          icon={Eye} 
          color="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard 
          title="Xe đang sẵn bán" 
          value={kpis.carCount} 
          subtitle="Hiện diện trong kho"
          icon={Car} 
          color="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard 
          title="Tỷ lệ quan tâm" 
          value={kpis.conversionRate} 
          subtitle="Lượt xem / Khách truy cập"
          icon={TrendingUp} 
          color="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Chart + Top Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ xu hướng truy cập */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> Xu hướng truy cập theo ngày
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Dữ liệu hiển thị chuẩn ngày/tháng đến hôm nay</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {timeRange === "7d" ? "7 ngày qua" : timeRange === "30d" ? "30 ngày qua" : timeRange === "90d" ? "90 ngày qua" : "1 năm qua"}
            </span>
          </div>

          <div className="h-[300px] w-full mt-2">
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    minTickGap={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#2563EB" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                Chưa có dữ liệu truy cập trong khoảng thời gian này.
              </div>
            )}
          </div>
        </div>

        {/* Top Xe Xem Nhiều (Click được + ảnh to đẹp + chuẩn icon) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" /> Top xe được xem nhiều
              </h3>
              <span className="text-xs text-gray-400">Bấm để xem chi tiết</span>
            </div>

            <div className="space-y-3">
              {topCars.length === 0 ? (
                <p className="text-gray-400 text-xs italic text-center py-8">Chưa có dữ liệu xem xe nào.</p>
              ) : (
                topCars.map((item, index) => (
                  <Link
                    to={`/cars/${item._id}`}
                    key={item._id || index}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50/40 transition group cursor-pointer"
                    title={`Xem chi tiết ${item.carName}`}
                  >
                    {/* Thumbnail lớn hơn, tỷ lệ chuẩn 4:3, không bị khuất */}
                    <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 relative shadow-2xs">
                      {item.carImage && item.carImage !== 'default_url' ? (
                        <OptimizedImage
                          src={item.carImage}
                          alt={item.carName || "Xe hơi"}
                          width={120}
                          height={90}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Car className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-red-600 transition" title={item.carName}>
                        {item.carName || 'Xe không xác định'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {item.price && (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {new Intl.NumberFormat('vi-VN').format(item.price)} Triệu
                          </span>
                        )}
                        <span className="text-gray-400 text-xs flex items-center gap-1 font-medium">
                          <Eye className="w-3.5 h-3.5" /> {item.count} lượt
                        </span>
                      </div>
                    </div>
                    
                    {/* Badge thứ hạng sang xịn */}
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xs shadow-2xs ${
                      index === 0 ? 'bg-amber-400 text-white' : 
                      index === 1 ? 'bg-slate-300 text-slate-800' : 
                      index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index === 0 ? <Crown className="w-4 h-4 fill-white" /> : `#${index + 1}`}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link
            to="/admin/cars"
            className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1 transition"
          >
            Quản lý tất cả xe trong kho <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Action & Highlight Bar (Giúp giao diện đầy đặn, hiện đại) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Highlight xe bán chạy */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 rounded-2xl border border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Crown className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">Xe được săn đón nhất</span>
              <p className="font-bold text-gray-900 text-sm line-clamp-1">
                {topCars[0]?.carName || "Đang thu thập dữ liệu..."}
              </p>
            </div>
          </div>
          {topCars[0] && (
            <Link
              to={`/cars/${topCars[0]._id}`}
              className="text-xs font-bold text-amber-800 hover:bg-amber-100 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm flex items-center gap-1 transition"
            >
              Xem ngay <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Phím tắt quản trị nhanh */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Phím tắt tác vụ nhanh</h4>
            <p className="text-xs text-gray-500 mt-0.5">Truy cập nhanh các thao tác vận hành hàng ngày</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/add-car"
              className="flex items-center gap-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Đăng xe mới
            </Link>
            <a
              href="https://kiencuongauto.vn"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl transition"
            >
              <ExternalLink className="w-4 h-4" /> Xem web live
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;