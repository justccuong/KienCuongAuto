import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaBuilding, FaArrowRight } from "react-icons/fa";

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await api.get("/branches");
        
        // Logic sắp xếp: Trụ sở chính -> Cơ sở 1, 2...
        const sortedBranches = res.data.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA.includes("trụ sở chính")) return -1;
          if (nameB.includes("trụ sở chính")) return 1;

          const getNumber = (str) => {
            const match = str.match(/cơ sở\s*(\d+)/i);
            return match ? parseInt(match[1], 10) : 999;
          };

          return getNumber(nameA) - getNumber(nameB);
        });

        setBranches(sortedBranches);
      } catch (error) {
        console.error("Lỗi lấy danh sách chi nhánh:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <span className="text-red-600 font-bold uppercase tracking-wider text-sm bg-red-50 px-4 py-1 rounded-full border border-red-100 mb-4 inline-block">
            Hệ thống Showroom
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Chi nhánh Kiên Cường Auto
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Mạng lưới phủ rộng khắp các tỉnh thành, mang đến sự thuận tiện tối đa cho quý khách hàng trong việc tham quan và mua sắm.
          </p>
        </div>

        {/* GRID CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <Link
              to={`/branches/${branch.id}`}
              key={branch.id}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2"
            >
              {/* Ảnh Card - Tràn viền & Zoom Effect */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Kien+Cuong+Auto"; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient đen mờ bên dưới ảnh */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                
                {/* Badge tên ngắn gọn */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                   <div className="flex items-center gap-2 text-sm font-medium bg-black/30 backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/20">
                      <FaBuilding className="text-yellow-400" /> Showroom
                   </div>
                </div>
              </div>

              {/* Nội dung Card */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {branch.name}
                </h3>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2">{branch.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                    <FaPhoneAlt className="text-green-600 flex-shrink-0" />
                    <span>{branch.hotline}</span>
                  </div>
                </div>

                {/* Nút Xem chi tiết */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-800 py-3 rounded-xl font-bold group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    Xem xe tại đây <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesPage;