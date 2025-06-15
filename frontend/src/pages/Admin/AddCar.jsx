import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCarForm from "../../components/sections/AddCarForm";
import axios from "axios";

const AddCar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data); // -> nên log ra nếu cần debug: console.log("User info:", res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Hiển thị trong lúc chờ load user info
  if (loading) {
    return <p className="p-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>;
  }

  // Nếu chưa đăng nhập
  if (!user) {
    navigate("/login");
    return null;
  }

  // Nếu không phải admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-6 text-center text-red-600 text-lg font-semibold border border-red-300 rounded-xl shadow-md bg-red-50">
          🚫 Bạn không có quyền truy cập trang này.
        </div>
      </div>
    );
  }

  // Nếu là admin => Hiển thị form
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Thêm xe mới</h1>
      <AddCarForm />
    </div>
  );
};

export default AddCar;
