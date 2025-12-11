import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaArrowRight, FaBuilding } from "react-icons/fa"; 

const BranchesGrid = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await api.get("/branches");

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
      } catch (err) {
        console.error("Lỗi fetch danh sách chi nhánh:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Hệ thống chi nhánh của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mạng lưới phủ rộng khắp các tỉnh thành, mang đến sự thuận tiện tối đa cho quý khách hàng.
          </p>
        </div>

        {branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch) => (
              <Link
                to={`/branches/${branch.id}`}
                key={branch._id || branch.id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x400?text=Kien+Cuong+Auto";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                     <div className="flex items-center gap-2 text-sm font-medium bg-black/30 backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/20">
                        <FaBuilding className="text-yellow-400" /> Showroom
                     </div>
                  </div>
                </div>

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

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-800 py-3 rounded-xl font-bold group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      Xem chi tiết <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
             <p>Chưa có thông tin chi nhánh nào.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchesGrid;