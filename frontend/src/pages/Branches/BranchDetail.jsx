import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import OptimizedImage from "../../components/input/OptimizedImage";
import Pagination from "../../components/ui/Pagination";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaTiktok,
  FaComments,
  FaArrowLeft,
  FaCar
} from "react-icons/fa";

const ITEMS_PER_PAGE = 16; 

const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const carsListRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const branchesRes = await api.get("/branches");
        const matchedBranch = branchesRes.data.find((b) => b.id === id || b._id === id);

        if (!matchedBranch) {
          setError("Không tìm thấy chi nhánh này.");
          setLoading(false);
          return;
        }

        setBranch(matchedBranch);

        if (matchedBranch.name) {
          const carsRes = await api.get(`/cars?branch=${encodeURIComponent(matchedBranch.name)}`);
          setCars(carsRes.data);
        }
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCars = cars.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (carsListRef.current) {
        carsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin chi nhánh...</p>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="text-red-500 text-6xl mb-4">
          <FaCar />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rất tiếc!</h2>
        <p className="text-gray-600 mb-6">{error || "Không tìm thấy chi nhánh yêu cầu."}</p>
        <Link
          to="/branches"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-6">
          <Link
            to="/branches"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition font-medium"
          >
            <FaArrowLeft className="mr-2" /> Quay lại danh sách chi nhánh
          </Link>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-10">
          <div className="relative h-64 md:h-80 lg:h-96 w-full">
            <img
              src={branch.image}
              alt={branch.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/1200x600?text=Kien+Cuong+Auto";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{branch.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/90 text-sm md:text-base">
                <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaMapMarkerAlt className="text-red-500" /> {branch.location}
                </span>
                <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaPhoneAlt className="text-green-500" /> {branch.hotline}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Giới thiệu</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{branch.description || "Chưa có mô tả cho chi nhánh này."}</p>
              </div>
              
              <div className="flex-shrink-0">
                 <h3 className="text-xl font-bold text-gray-800 mb-3">Liên hệ</h3>
                 <div className="flex gap-4">
                    {branch.socials?.facebook && (
                      <a href={branch.socials.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition text-2xl">
                        <FaFacebook />
                      </a>
                    )}
                    {branch.socials?.tiktok && (
                      <a href={branch.socials.tiktok} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-black hover:bg-black hover:text-white transition text-2xl">
                        <FaTiktok />
                      </a>
                    )}
                    {branch.socials?.zalo && (
                      <a href={branch.socials.zalo} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition text-xl font-bold border border-blue-200">
                        Zalo
                      </a>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12" ref={carsListRef}> 
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Xe đang bán tại <span className="text-red-600">{branch.name}</span>
            </h2>
            <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
              {cars.length} xe
            </span>
          </div>

          {cars.length > 0 ? (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentCars.map((car) => (
                    <div
                    key={car._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                    onClick={() => navigate(`/cars/${car._id}`)}
                    >
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                        src={car.images?.[0]?.url}
                        alt={car.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        {car.year}
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={car.name}>
                        {car.name}
                        </h3>
                        <p className="text-red-600 font-extrabold text-xl mb-3">
                        {car.price} triệu
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                        <div className="flex flex-col items-center gap-1">
                            <i className="fas fa-cogs text-gray-400 text-sm"></i>
                            <span>{car.gearbox}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-1">
                            <i className="fas fa-gas-pump text-gray-400 text-sm"></i>
                            <span>{car.fuel || "N/A"}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-1">
                            <i className="fas fa-road text-gray-400 text-sm"></i>
                            <span>{car.kilometers} km</span>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                <Pagination 
                    itemsPerPage={ITEMS_PER_PAGE} 
                    totalItems={cars.length} 
                    currentPage={currentPage}
                    onPageChange={paginate}
                />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <FaCar className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có xe nào</h3>
              <p className="text-gray-500">Hiện tại chi nhánh này chưa cập nhật danh sách xe.</p>
            </div>
          )}
        </div>

        {branch.mapsEmbed && (
          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Vị trí trên bản đồ</h2>
              {branch.mapsUrl && (
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-200"
                >
                  <FaMapMarkerAlt /> Chỉ đường đến đây
                </a>
              )}
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-inner bg-gray-100 h-[400px] border border-gray-200">
              <iframe
                src={branch.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Bản đồ ${branch.name}`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchDetail;