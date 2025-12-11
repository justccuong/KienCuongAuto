import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../input/OptimizedImage";
import api from "../../utils/axios"; // Nhớ import cái này để nó nhận đúng port 5000

const CarSearchBar = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Debounce: Chờ user gõ xong 500ms mới gọi API cho đỡ lag server
    const delayDebounce = setTimeout(() => {
      const fetchCars = async () => {
        if (!searchTerm.trim()) {
          setCars([]);
          return;
        }

        setLoading(true);
        try {
          // Dùng api instance thay vì fetch thường
          const res = await api.get(`/cars?name=${encodeURIComponent(searchTerm)}`);
          
          // Axios trả data trong res.data
          // Check kỹ logic backend trả về mảng hay object
          const result = res.data;
          setCars(Array.isArray(result) ? result : result.cars || []);
        } catch (error) {
          console.error("Lỗi fetch xe:", error);
          setCars([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCars();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleClick = (id) => {
    navigate(`/cars/${id}`);
    setSearchTerm(""); // Chọn xong thì xóa text đi cho gọn
    setCars([]);       // Ẩn luôn danh sách gợi ý
  };

  return (
    <div className="relative w-full max-w-[430px]">
      <input
        type="text"
        placeholder="Tìm tên xe (vd: Mazda, CX5...)"
        className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Icon search */}
      <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

      {/* Dropdown kết quả */}
      {searchTerm && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-2xl animate-fade-in-down">
          {loading ? (
            <li className="px-4 py-3 text-gray-500 text-center text-sm">
              <i className="fas fa-spinner fa-spin mr-2"></i> Đang tìm kiếm...
            </li>
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <li
                key={car._id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer border-b last:border-none transition-colors"
                onClick={() => handleClick(car._id)}
              >
                {/* Ảnh thumbnail - Đã chỉnh lại size cho đẹp */}
                <div className="w-14 h-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {car.images && car.images.length > 0 ? (
                    <OptimizedImage
                      src={car.images[0].url}
                      alt={car.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No img
                    </div>
                  )}
                </div>

                {/* Thông tin xe */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{car.name}</p>
                  <p className="text-xs text-gray-500 flex justify-between">
                    <span>{car.year}</span>
                    <span className="text-red-600 font-medium">{car.branch}</span>
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-center text-gray-500 text-sm">
              Không tìm thấy xe nào phù hợp 😅
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CarSearchBar;