import React, { useState } from "react";
// 👇 FIX: Thêm TrendingUp vào đây để dùng cho tab Analytics
import { BarChart, Users, Eye, TrendingUp } from "lucide-react"; 
import CarManager from "./CarManager"; 
import AnalyticsDashboard from "./AnalyticsDashBoard"; 

const AdminOverview = () => {
  // State quyết định Tab nào đang được chọn
  const [activeTab, setActiveTab] = useState("car"); // Mặc định là Quản lý Xe

  // Định nghĩa các Tab (Dữ liệu này không cần dùng Icon: Component làm gì)
  const tabs = [
    { id: "car", name: "Quản lý Kho Xe" }, 
    { id: "analytics", name: "Thống kê Truy cập" },
  ];

  const TabButton = ({ id, name }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 text-sm font-semibold transition-all duration-300 border-b-2 flex items-center gap-2 ${
        activeTab === id
          ? "border-red-600 text-red-600 bg-red-50/50" // Tab active
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300" // Tab inactive
      }`}
    >
      {/* Tùy chỉnh icon theo id */}
      {id === 'car' ? <BarChart size={18} /> : <TrendingUp size={18} />} 
      <span>{name}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Thanh Tab ở trên cùng */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex">
          {tabs.map((tab) => (
            <TabButton 
              key={tab.id} 
              id={tab.id} 
              name={tab.name} 
            />
          ))}
        </div>
      </div>

      {/* Nội dung Tab */}
      <div className="max-w-7xl mx-auto pt-6 pb-20">
        {/* Render component tương ứng với Tab active */}
        {activeTab === "car" && <CarManager />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default AdminOverview;