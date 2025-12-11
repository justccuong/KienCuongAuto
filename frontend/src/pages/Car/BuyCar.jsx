import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaCar, FaMapMarkerAlt } from "react-icons/fa";

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
    "Màu Trắng", 
    "Màu Đen", 
    "Màu Xám (Grey)", 
    "Màu Bạc (Silver)",
    "Màu Đỏ", 
    "Màu Đỏ Đô", 
    "Màu Cam", 
    "Màu Vàng", 
    "Màu Vàng Cát", 
    "Màu Vàng Đồng", 
    "Màu Champagne", 
    "Màu Be (Beige)",
    "Màu Xanh (Blue)", 
    "Màu Xanh Đen (Cavansite)", 
    "Màu Xanh Lá", 
    "Màu Xanh Ngọc", 
    "Màu Xanh Rêu",
    "Màu Nâu (Cafe)", 
    "Màu Nâu Đất", 
    "Màu Tím", 
    "Màu Hồng", 
    "Màu Titan",
  ];

const ITEMS_PER_PAGE = 15; 

const FindCarPage = () => {
  const [cars, setCars] = useState([]);
  const [branches, setBranches] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false); 

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [carsRes, branchesRes] = await Promise.all([
          api.get("/cars"),
          api.get("/branches")
        ]);
        setCars(carsRes.data);
        setBranches(branchesRes.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = !search || car.name.toLowerCase().includes(search.toLowerCase());
    
    const price = parseInt(car.price || 0);
    const matchesMinPrice = !minPrice || price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || price <= parseInt(maxPrice);

    const matchesFilters = Object.keys(filters).every((key) => {
      if (!filters[key]) return true; 
      return car[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesFilters;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search, minPrice, maxPrice]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-red-600"><FaCar /></span> Tìm mua xe
          </h1>
          
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Nhập tên xe cần tìm (VD: Mazda CX5...)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>

          <button 
            className="md:hidden flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow border"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                <FaFilter className="text-red-600" /> Bộ lọc tìm kiếm
              </h3>

              <div className="mb-6">
                <label className="font-semibold text-sm mb-2 block">Khoảng giá (Triệu)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Từ"
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="font-semibold text-sm mb-1 block">Chi nhánh</label>
                <select
                  name="branch"
                  value={filters.branch || ""}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:ring-1 focus:ring-red-500"
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
                  <label className="font-semibold text-sm mb-1 block">{label}</label>
                  <select
                    name={key}
                    value={filters[key] || ""}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:ring-1 focus:ring-red-500"
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
                onClick={() => {
                  setFilters({});
                  setMinPrice("");
                  setMaxPrice("");
                  setSearch("");
                }}
                className="w-full mt-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh sách xe...</p>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <FaSearch className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Không tìm thấy xe nào</h3>
                <p className="text-gray-500 mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc xem sao.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center px-2">
                  <p className="text-gray-600">
                      Tìm thấy <strong>{filteredCars.length}</strong> xe phù hợp
                      <span className="text-sm ml-2 text-gray-400">(Trang {currentPage})</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentCars.map((car) => (
                    <Link
                      to={`/cars/${car._id}`}
                      key={car._id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 hover:-translate-y-1 block"
                    >
                      {/* Ảnh xe */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          src={car.images?.[0]?.url}
                          alt={car.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2 py-1 rounded shadow-sm border border-gray-100">
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
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 bg-gray-50 -mx-4 -mb-4 px-4 py-3 mt-2">
                          <div className="flex flex-col items-center gap-1">
                             <i className="fas fa-cogs text-gray-400"></i>
                             <span className="font-medium">{car.gearbox}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-300"></div>
                          <div className="flex flex-col items-center gap-1">
                             <i className="fas fa-gas-pump text-gray-400"></i>
                             <span className="font-medium">{car.fuel || "N/A"}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-300"></div>
                          <div className="flex flex-col items-center gap-1">
                             <i className="fas fa-road text-gray-400"></i>
                             <span className="font-medium">{car.kilometers} km</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-2 text-xs font-bold text-red-600 flex items-center gap-1 truncate border-t border-gray-100">
                          <FaMapMarkerAlt /> {car.branch}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Pagination 
                    itemsPerPage={ITEMS_PER_PAGE} 
                    totalItems={filteredCars.length} 
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