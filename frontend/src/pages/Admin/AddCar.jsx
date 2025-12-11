import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddCarForm from "../../components/sections/AddCarForm";
import api from "../../utils/axios";
import '@fortawesome/fontawesome-free/css/all.min.css';
const AddCar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <i className="fas fa-circle-notch fa-spin text-red-600 text-3xl"></i>
            <p className="text-gray-600 font-medium">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 text-center bg-white rounded-2xl shadow-xl border-t-4 border-red-500 max-w-md">
          <i className="fas fa-ban text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
          <Link to="/home" className="mt-6 inline-block text-blue-600 hover:underline font-medium">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors font-semibold group"
        >
          <i className="fas fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i> 
          Quay lại Quản lý
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-5 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
               <i className="fas fa-plus-circle opacity-80"></i>
               Thêm ô tô mới vào kho
            </h1>
            <span className="text-red-100 text-sm hidden sm:inline-block bg-white/20 px-3 py-1 rounded-full">
              Admin Panel
            </span>
          </div>

          <div className="p-6 md:p-10">
            <AddCarForm />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddCar;