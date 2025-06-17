import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../input/OptimizedImage";

const CarSearchBar = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchCars = async () => {
        if (!searchTerm) {
          setCars([]);
          return;
        }

        setLoading(true);
        try {
          const res = await fetch(
            `/cars?name=${encodeURIComponent(searchTerm)}`
          );
          const data = await res.json();
          setCars(Array.isArray(data) ? data : data.cars || []);
        } catch (error) {
          console.error("Lỗi fetch xe:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCars();
    }, 400); // delay 400ms

    return () => clearTimeout(delayDebounce); // clear timeout nếu user gõ tiếp
  }, [searchTerm]);

  const handleClick = (id) => {
    navigate(`/cars/${id}`);
  };

  return (
    <div className="relative w-full max-w-[430px]">
      <input
        type="text"
        placeholder="Tìm xe..."
        className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

      {searchTerm && (
        <ul className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {loading ? (
            <li className="px-4 py-2 italic text-gray-500">Đang tải dữ liệu...</li>
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <li
                key={car._id}
                className="flex items-center justify-between px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleClick(car._id)}
              >
                <div className="flex items-center gap-2">
                  {Array.isArray(car.images) && car.images.length > 0 && (
                    <OptimizedImage
                      src={car.images?.[0]?.url}
                      alt={car.name}
                      width={360}
                      height={360}
                      className="w-full h-5 object-cover rounded"
                    />
                  )}
                  <span>{car.name} ({car.year})</span>
                </div>
                <span className="text-sm text-gray-500">{car.branch}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 italic text-gray-500">Không tìm thấy xe nào</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CarSearchBar;
