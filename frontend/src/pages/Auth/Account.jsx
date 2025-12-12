import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Lấy thông tin user mới nhất từ Server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      } catch (err) {
        // Nếu token hết hạn hoặc lỗi -> đá về login
        console.error(err);
        toast.error("Phiên đăng nhập hết hạn");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // 2. Xử lý cập nhật thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/me", { name, phone });
      
      const updatedUser = res.data.user;
      setUser(updatedUser);

      // 👇 QUAN TRỌNG: Phải cập nhật cả LocalStorage để các component khác (Header/AdminRoute) nhận diện
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("✅ Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý Đăng xuất
  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      try {
        await api.post("/auth/logout"); // Gọi API xóa cookie
        localStorage.removeItem("user"); // Xóa local storage
        toast.info("Đã đăng xuất 👋");
        navigate("/login");
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        // Kể cả lỗi API cũng cứ xóa local và đá về cho chắc
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Hồ sơ cá nhân</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
          {user.role}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Họ và tên</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nhập tên hiển thị"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="0xxxxxxxxx"
            pattern="^0\d{9,10}$"
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email (Không thể thay đổi)</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            value={user.email}
            disabled
          />
        </div>

        {/* Buttons Group */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-white shadow-md transition-all ${
              loading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 py-2.5 px-4 rounded-lg font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
          >
            Đăng xuất
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;