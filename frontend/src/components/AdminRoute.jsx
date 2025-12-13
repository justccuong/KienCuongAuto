import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// 👇 Import cái Hook mình vừa tạo trong Context
import { useAuth } from "../context/AuthContext"; 

const AdminRoute = () => {
  // 1. Lấy dữ liệu từ "Tổng quản" AuthContext
  // user: Thông tin user (đã được server xác thực qua cookie)
  // isLoading: Trạng thái "đang hỏi server"
  const { user, isLoading } = useAuth();

  // 2. Màn hình chờ (Loading)
  // CỰC QUAN TRỌNG: Khi F5, React cần chút thời gian để check cookie.
  // Nếu không có đoạn này, user sẽ bị đá ra trang Login oan uổng.
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h3>⏳ Đang kiểm tra quyền Admin...</h3>
      </div>
    );
  }

  // 3. Logic chặn cửa (Check Role từ dữ liệu Server trả về)
  const isAdmin = user && (user.role === 'admin' || user.role === 'ADMIN');

  // 4. Quyết định
  if (!isAdmin) {
    // Nếu không phải Admin, đá về trang chủ (hoặc trang login tùy ý)
    return <Navigate to="/" replace />;
  }

  // 5. Admin xịn -> Mở cửa (Outlet cho các route con hiển thị)
  return <Outlet />;
};

export default AdminRoute;