import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Tạo Context
const AuthContext = createContext();

// Provider bọc ngoài App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm gọi API check xem Cookie có hợp lệ không
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      // Gọi lên route /me mà Hoàng tử vừa viết bên backend
      const res = await axios.get("/api/auth/me");
      
      // Nếu OK, lưu user vào State
      setUser(res.data);
    } catch (error) {
      // Nếu lỗi (401, 403) -> Chưa đăng nhập hoặc Token hết hạn
      setUser(null);
    } finally {
      setIsLoading(false); // Dù thành công hay thất bại cũng phải tắt Loading
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm Login (Gọi khi user bấm nút Đăng nhập thành công)
  const login = (userData) => {
    setUser(userData);
  };

  // Hàm Logout
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout"); // Gọi API xóa cookie
      setUser(null); // Xóa state
      // Có thể thêm điều hướng về trang chủ ở đây nếu muốn
    } catch (error) {
      console.error("Lỗi logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};