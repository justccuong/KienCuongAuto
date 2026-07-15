import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Car, MapPin, RefreshCw, Settings, Fuel, Route } from "lucide-react";

import ColorSelect from "../../components/input/ColorSelect";
import SearchableSelect from "../../components/input/SearchableSelect";
import OptimizedImage from "../../components/input/OptimizedImage";
import Pagination from "../../components/ui/Pagination"; 

const FILTER_OPTIONS = {
  status: { label: "Tình trạng kho", values: ["Sẵn xe", "Hết hàng"] },
  condition: { label: "Tình trạng xe", values: ["Xe mới", "Xe đã qua sử dụng"] },
  fuel: { label: "Nhiên liệu", values: ["Xăng", "Dầu", "Điện"] },
  gearbox: { label: "Hộp số", values: ["Hộp số tự động", "Hộp số sàn"] },
  drive: { label: "Dẫn động", values: ["4 bánh toàn thời gian", "2 bánh trước", "2 bánh sau"] },
  installment: { label: "Trả góp", values: ["Không hỗ trợ trả góp", "Hỗ trợ trả góp lên tới 70% giá trị xe"] },
};

const MANUFACTURER_OPTIONS = [
  "Ford", "Vinfast", "Subaru", "Toyota", "Honda", "KIA", "Hyundai", "Mazda",
  "Nissan", "Suzuki", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Lexus",
  "Mitsubishi", "Isuzu", "Chevrolet", "Daehan", "Dongfeng", "Foton", "Hino",
  "JAC", "Jeep", "Land Rover", "MG", "Mini", "Peugeot", "Porsche", "Renault",
  "Skoda", "SsangYong", "Tata",
];

const COLOR_OPTIONS = [
    "Màu Trắng", "Màu Đen", "Màu Xám (Grey)", "Màu Bạc (Silver)",
    "Màu Đỏ", "Màu Đỏ Đô", "Màu Cam", "Màu Vàng", "Màu Vàng Cát", 
    "Màu Vàng Đồng", "Màu Champagne", "Màu Be (Beige)", "Màu Xanh (Blue)", 
    "Màu Xanh Đen (Cavansite)", "Màu Xanh Lá", "Màu Xanh Ngọc", 
    "Màu Xanh Rêu", "Màu Nâu (Cafe)", "Màu Nâu Đất", "Màu Tím", 
    "Màu Hồng", "Màu Titan",
];

const ITEMS_PER_PAGE = 15; 

const FindCarPage = () => {
  const [cars, setCars] = useState([]);
  const [branches, setBranches] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false); 

  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearch, minPrice, maxPrice]);

  // Fetch Data (Server-side filtering & pagination)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page: currentPage, limit: ITEMS_PER_PAGE };
        if (debouncedSearch) params.name = debouncedSearch;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        
        const [carsRes, branchesRes] = await Promise.all([
          api.get("/cars", { params }),
          api.get("/branches")
        ]);
        
        if (carsRes.data && carsRes.data.cars) {
          setCars(carsRes.data.cars);
          setTotalItems(carsRes.data.total);
        } else {
          const dataArray = Array.isArray(carsRes.data) ? carsRes.data : [];
          setCars(dataArray);
          setTotalItems(dataArray.length);
        }
        setBranches(branchesRes.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters, debouncedSearch, minPrice, maxPrice, currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-red-600"><Car size={28} /></span> Tìm mua xe
          </h1>
          
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Nhập tên xe cần tìm (VD: Mazda CX5...)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <button 
            className="md:hidden flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow border active:bg-gray-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} /> {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR BỘ LỌC */}
          <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 top-20">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="text-red-600" size={18} /> Bộ lọc
                </h3>
                <button onClick={resetFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <RefreshCw size={12} /> Đặt lại
                </button>
              </div>

              <div className="mb-6">
                <label className="font-semibold text-sm mb-2 block text-gray-700">Khoảng giá (Triệu VNĐ)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Từ"
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="font-semibold text-sm mb-1 block text-gray-700">Chi nhánh</label>
                <select
                  name="branch"
                  value={filters.branch || ""}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:ring-1 focus:ring-red-500 outline-none"
                >
                  <option value="">-- Tất cả chi nhánh --</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <SearchableSelect
                  label="Hãng sản xuất"
                  name="manufacturer"
                  value={filters.manufacturer}
                  options={MANUFACTURER_OPTIONS}
                  onChange={handleFilterChange}
                />
              </div>

              {Object.entries(FILTER_OPTIONS).map(([key, { label, values }]) => (
                <div className="mb-4" key={key}>
                  <label className="font-semibold text-sm mb-1 block text-gray-700">{label}</label>
                  <select
                    name={key}
                    value={filters[key] || ""}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="">-- Tất cả --</option>
                    {values.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t">
                <ColorSelect
                  label="Màu sắc"
                  name="color"
                  value={filters.color}
                  options={COLOR_OPTIONS}
                  onChange={handleFilterChange}
                />
              </div>

              <button
                onClick={resetFilters}
                className="w-full mt-6 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-bold text-sm"
              >
                XÓA TẤT CẢ BỘ LỌC
              </button>
            </div>
          </div>

          {/* MAIN CONTENT: DANH SÁCH XE */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải dữ liệu xe...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Không tìm thấy xe nào</h3>
                <p className="text-gray-500 mt-1 px-4">Hãy thử điều chỉnh khoảng giá hoặc bỏ bớt bộ lọc xem sao.</p>
                <button onClick={resetFilters} className="mt-4 text-red-600 font-medium hover:underline">
                  Xóa bộ lọc để xem tất cả
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center px-2 border-l-4 border-red-600 pl-3">
                  <p className="text-gray-700 font-medium">
                      Tìm thấy <strong className="text-red-600 text-lg">{totalItems}</strong> xe phù hợp
                  </p>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded">Trang {currentPage}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <Link
                      to={`/cars/${car._id}`}
                      key={car._id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 hover:-translate-y-1 block h-full flex flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                        <OptimizedImage
                          src={car.images?.[0]?.url}
                          alt={car.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                          {car.year}
                        </div>
                        {car.condition === "Xe mới" && (
                           <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                             NEW
                           </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]" title={car.name}>
                          {car.name}
                        </h3>
                        <p className="text-red-600 font-extrabold text-xl mb-3">
                          {new Intl.NumberFormat('vi-VN').format(car.price)} Triệu
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 bg-gray-50 -mx-4 px-4 py-3 mt-auto">
                          <div className="flex flex-col items-center gap-1">
                             <Settings className="text-gray-400" size={14} />
                             <span className="font-medium">{car.gearbox?.replace("Hộp số ", "")}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-200"></div>
                          <div className="flex flex-col items-center gap-1">
                             <Fuel className="text-gray-400" size={14} />
                             <span className="font-medium">{car.fuel || "N/A"}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-200"></div>
                          <div className="flex flex-col items-center gap-1">
                             <Route className="text-gray-400" size={14} />
                             <span className="font-medium">{car.kilometers ? `${car.kilometers} km` : "0 km"}</span>
                          </div>
                        </div>
                        
                        <div className="mt-0 pt-2 text-xs font-bold text-red-600 flex items-center gap-1 truncate border-t border-gray-100 bg-white -mx-4 px-4 pb-0 h-8">
                          <MapPin size={14} /> <span className="truncate">{car.branch}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Pagination 
                    itemsPerPage={ITEMS_PER_PAGE} 
                    totalItems={totalItems} 
                    currentPage={currentPage}
                    onPageChange={paginate}
                />

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindCarPage;