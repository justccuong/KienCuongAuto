// src/context/AuthContext.js
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
      // ✅ THÊM: Đồng bộ với localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      // Nếu lỗi (401, 403) -> Chưa đăng nhập hoặc Token hết hạn
      setUser(null);
      localStorage.removeItem("user"); // ✅ Xóa localStorage khi invalid
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm Login (Gọi khi user bấm nút Đăng nhập thành công)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ Lưu localStorage
  };

  // Hàm Logout
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Lỗi logout", error);
    } finally {
      // ✅ Luôn clear state dù API fail
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // ✅ EXPORT setUser để Login component có thể dùng
      isLoading, 
      login, 
      logout, 
      fetchUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};