import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import OptimizedImage from "../../components/input/OptimizedImage";
import Pagination from "../../components/ui/Pagination"; // Tận dụng lại component phân trang cũ
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCar, FaMapMarkerAlt } from "react-icons/fa";

const ITEMS_PER_PAGE = 12; // Số xe mỗi trang quản lý

const AdminOverview = () => {
  const [branches, setBranches] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State cho Tìm kiếm & Phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // 1. Lấy danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get("/branches");
        // Sắp xếp chi nhánh: Trụ sở chính lên đầu, còn lại theo số
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
        if (sortedBranches.length > 0) {
          setSelectedBranch(sortedBranches[0].name);
        }
      } catch (err) {
        console.error("Lỗi fetch danh sách chi nhánh:", err);
      }
    };
    fetchBranches();
  }, []);

  // 2. Lấy danh sách xe khi đổi chi nhánh
  useEffect(() => {
    if (!selectedBranch) return;

    const fetchCars = async () => {
      setLoading(true);
      try {
        // Lấy toàn bộ xe của chi nhánh về, sau đó lọc ở Client cho nhanh mượt
        const res = await api.get(`/cars?branch=${encodeURIComponent(selectedBranch)}`);
        setCars(res.data);
        setCurrentPage(1); // Reset về trang 1 khi đổi chi nhánh
        setSearchTerm(""); // Reset tìm kiếm
      } catch (err) {
        console.error("Lỗi khi fetch xe: ", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [selectedBranch]);

  // 3. Logic Tìm kiếm & Phân trang (Client-side)
  const filteredCars = useMemo(() => {
    return cars.filter(car => 
      car.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cars, searchTerm]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);

  // 4. Xử lý Xóa xe
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xoá chiếc xe này khỏi hệ thống?")) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
      // Nếu trang hiện tại hết xe thì lùi về 1 trang
      if (currentCars.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      console.error("Lỗi khi xoá xe: ", err);
      alert("Xoá thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* HEADER & WARNING */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
          <FaCar className="text-red-600" /> Quản lý Kho Xe
        </h1>
        <p className="text-gray-500 text-sm mb-6">Quản lý danh sách, thêm, sửa, xóa xe tại các chi nhánh.</p>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm text-sm text-orange-800 mb-8">
          <p className="font-bold flex items-center gap-2 mb-1">
            <i className="fas fa-exclamation-triangle"></i> Lưu ý quan trọng cho Admin:
          </p>
          <ul className="list-disc pl-5 space-y-1 opacity-90">
            <li>Muốn thay đổi ảnh: Hãy <strong>Xoá xe cũ</strong> và <strong>Thêm xe mới</strong> (do cơ chế CDN).</li>
            <li>Chỉ thao tác trên xe thuộc chi nhánh mình quản lý.</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          
          {/* PHẦN 1: CHỌN CHI NHÁNH (Ở TRÊN) */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-100 text-red-600 p-1.5 rounded-md text-xs">
                <FaMapMarkerAlt />
              </span>
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Đang xem kho tại:
              </label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {branches.map((branch) => (
                <button
                  key={branch._id || branch.id}
                  onClick={() => setSelectedBranch(branch.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border relative ${
                    selectedBranch === branch.name
                      ? "bg-red-50 text-red-700 border-red-200 shadow-sm z-10 ring-1 ring-red-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {/* Dấu chấm xanh báo hiệu đang chọn */}
                  {selectedBranch === branch.name && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                  {branch.name}
                </button>
              ))}
            </div>
          </div>

          {/* 👇 VÁCH NGĂN (DIVIDER) TẠO SỰ CÂN ĐỐI 👇 */}
          <div className="h-px w-full bg-gray-100"></div>

          {/* PHẦN 2: THANH CÔNG CỤ TÌM KIẾM & NÚT THÊM (Ở DƯỚI) */}
          <div className="p-4 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Ô tìm kiếm (Kéo dài ra cho đẹp) */}
            <div className="relative w-full md:max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Gõ tên xe để tìm nhanh..." 
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                         transition-all duration-200"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Nút thêm xe */}
            <Link to="/admin/add-car" className="w-full md:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-md font-bold transition-transform active:scale-95">
                <FaPlus className="text-sm" /> 
                <span>Thêm Xe Mới</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* CAR LIST GRID */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
             <p className="text-gray-500 font-medium">Đang tải dữ liệu từ {selectedBranch}...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
             <div className="text-6xl mb-4">🚗</div>
             <p className="text-gray-600 font-medium text-lg">
               {searchTerm ? `Không tìm thấy xe nào có tên "${searchTerm}"` : "Kho xe này đang trống."}
             </p>
             {searchTerm && (
               <button onClick={() => setSearchTerm("")} className="mt-2 text-red-600 hover:underline">
                 Xóa tìm kiếm
               </button>
             )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <p className="text-gray-600 font-medium">
                Tìm thấy <strong className="text-red-600">{filteredCars.length}</strong> xe
              </p>
              <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border">Trang {currentPage}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={car.images?.[0]?.url}
                      alt={car.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
                      {car.year}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md font-bold text-gray-900 line-clamp-2 min-h-[3rem] mb-1" title={car.name}>
                      {car.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="truncate">{selectedBranch}</span>
                    </div>

                    <p className="text-red-600 font-extrabold text-lg mb-4">
                      {new Intl.NumberFormat('vi-VN').format(car.price)} Triệu
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => navigate(`/admin/edit-car/${car._id}`)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-semibold text-sm hover:bg-yellow-100 transition"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-semibold text-sm hover:bg-red-100 transition"
                      >
                        <FaTrash /> Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            <div className="mt-8 pb-8">
              <Pagination 
                itemsPerPage={ITEMS_PER_PAGE} 
                totalItems={filteredCars.length} 
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;