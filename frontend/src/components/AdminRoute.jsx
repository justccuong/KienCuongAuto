import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  // 1. Màn hình chờ (Loading)
  // CỰC QUAN TRỌNG: Khi F5, React cần thời gian để check cookie.
  // Nếu không có đoạn này, user sẽ bị đá ra trang Login oan uổng.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            ⏳ Đang kiểm tra quyền Admin...
          </h3>
          <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // 2. Logic chặn cửa (Check Role từ dữ liệu Server trả về)
  const isAdmin = user && (user.role === 'admin' || user.role === 'ADMIN');

  // 3. Quyết định
  if (!isAdmin) {
    // Không phải Admin -> Đá về trang chủ
    return <Navigate to="/home" replace />;
  }

  // 4. Admin xịn -> Mở cửa cho các route con hiển thị
  return <Outlet />;
};

export default AdminRoute;