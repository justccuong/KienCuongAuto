import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // 1. Lấy user từ LocalStorage (Vì bên Login mình lưu vào đây)
  const userStored = localStorage.getItem("user");
  
  let user = null;
  if (userStored) {
    try {
      user = JSON.parse(userStored);
    } catch (e) {
      user = null;
    }
  }

  // --- DEBUG LOG (Để soi xem nó đọc được gì) ---
  // console.log("🔍 AdminRoute check:", user);

  // 2. Logic kiểm tra
  const isUser = !!user; 
  // Chấp nhận cả chữ hoa chữ thường cho chắc
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  // 3. Chặn cửa
  if (!isUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Nếu là user thường thì đá về Home
    return <Navigate to="/home" replace />;
  }

  // 4. Admin xịn -> Cho vào
  return <Outlet />;
};

export default AdminRoute;