import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import OptimizedImage from "../../components/input/OptimizedImage";

const Overview = () => {
  const [branches, setBranches] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
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
        
        if (sortedBranches.length > 0) {
          setSelectedBranch(sortedBranches[0].name);
        }
      } catch (err) {
        console.error("Lỗi fetch danh sách chi nhánh:", err);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;

    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/cars?branch=${encodeURIComponent(selectedBranch)}`
        );
        setCars(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch xe theo chi nhánh: ", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [selectedBranch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá xe này?")) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá xe: ", err);
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-yellow-100 text-red-800 border border-yellow-400 p-4 rounded-xl mb-6 text-sm leading-relaxed">
        <p className="font-bold underline mb-1">⚠️ Lưu ý quan trọng:</p>
        <ul className="list-disc pl-5">
          <li>Trang chỉnh sửa hiện tại <strong>không hỗ trợ chỉnh sửa ảnh</strong>. Nếu cần thay đổi ảnh, hãy xoá xe và thêm lại.</li>
          <li>Tuyệt đối <strong>không chỉnh sửa hoặc xoá xe thuộc cơ sở khác</strong> nếu không có sự cho phép.</li>
          <li>Hệ thống có thể ghi lại địa chỉ IP người dùng để xử lý sai phạm nếu có ảnh hưởng đến dữ liệu chung.</li>
        </ul>
      </div>

      <h3 className="text-lg font-semibold mb-2">Chọn chi nhánh:</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <button
              key={branch._id || branch.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedBranch === branch.name
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedBranch(branch.name)}
            >
              {branch.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500 italic">Đang tải danh sách chi nhánh...</p>
        )}
      </div>

      <div className="mb-4">
        <Link to="/admin/add-car">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
            ➕ Thêm ô tô mới
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
            <p className="text-gray-500 mt-2">Đang tải dữ liệu xe...</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-600">Không có xe nào thuộc <strong>{selectedBranch}</strong>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="border bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transform transition duration-300 hover:scale-[1.02]"
              onClick={() => navigate(`/cars/${car._id}`)}
            >
              <OptimizedImage
                src={car.images?.[0]?.url}
                alt={car.name}
                width={360}
                height={180}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 text-black">
                <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem]">{car.name}</h3>
                <p className="text-red-700 font-bold text-lg my-2">
                  {car.price} triệu
                </p>
                <div className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-2">
                  <div className="text-center">
                      <span className="block text-xs font-semibold">Năm</span>
                      {car.year}
                  </div>
                  <div className="text-center border-l border-r px-2 w-full mx-2 border-gray-300">
                      <span className="block text-xs font-semibold">Hộp số</span>
                      {car.gearbox}
                  </div>
                  <div className="text-center">
                      <span className="block text-xs font-semibold">Km</span>
                      {car.kilometers}
                  </div>
                </div>

                <div className="mt-4 flex gap-2 pt-3 border-t">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/edit-car/${car._id}`);
                    }}
                    className="flex-1 px-3 py-2 bg-yellow-400 text-white rounded font-medium text-sm hover:bg-yellow-500 transition"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(car._id);
                    }}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded font-medium text-sm hover:bg-red-600 transition"
                  >
                    🗑 Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;