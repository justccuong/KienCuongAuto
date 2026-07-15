import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import OptimizedImage from "../input/OptimizedImage";
import { ArrowRight, Flame, Settings, Route } from "lucide-react";

const NewArrivalsSection = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewestCars = async () => {
      try {
        const res = await api.get("/cars", { params: { limit: 8 } });
        // Support both new paginated format and old array format
        const newestCars = res.data.cars || res.data;
        setCars(Array.isArray(newestCars) ? newestCars : []);
      } catch (err) {
        console.error("Lỗi fetch xe mới:", err);
      }
    };
    fetchNewestCars();
  }, []);

  if (cars.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-red-600 font-bold uppercase tracking-wider text-xs md:text-sm bg-red-50 px-3 py-1 rounded-full border border-red-100 mb-2 inline-block">
              <Flame className="inline mr-1" size={14} /> Hot Arrivals
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Xe Vừa Cập Bến
            </h2>
          </div>
          <Link 
            to="/find-car" 
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold transition"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid Xe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              onClick={() => navigate(`/cars/${car._id}`)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Fix ảnh: Dùng object-cover và object-center để ảnh luôn căn giữa, không bị méo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <OptimizedImage
                  src={car.images?.[0]?.url}
                  alt={car.name}
                  width={400} 
                  height={300}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                  MỚI VỀ
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-bold text-gray-900 mb-1 truncate group-hover:text-red-600 transition-colors" title={car.name}>
                  {car.name}
                </h3>
                <p className="text-red-600 font-extrabold text-lg mb-3">
                  {new Intl.NumberFormat('vi-VN').format(car.price)} Triệu
                </p>

                {/* Thông số kỹ thuật */}
                <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500 border-t pt-3 bg-gray-50 -mx-4 -mb-4 px-4 py-2.5">
                   <div className="flex items-center gap-1.5">
                      <Settings className="text-gray-400" size={14} /> 
                      <span className="truncate max-w-[80px]">{car.gearbox?.replace("Hộp số ", "")}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Route className="text-gray-400" size={14} /> 
                      <span>{car.kilometers}km</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút xem tất cả trên Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/find-car" 
            className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Xem tất cả xe <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;