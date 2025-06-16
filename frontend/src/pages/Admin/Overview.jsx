import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import OptimizedImage from "../../components/input/OptimizedImage";

const branches = [
  "Trụ sở chính Kiên Cường Auto",
  "Kiên Cường Auto Cơ Sở 1",
  "Kiên Cường Auto Cơ Sở 2",
  "Kiên Cường Auto Cơ Sở 4 - Tuyên Quang",
  "Kiên Cường Auto Cơ Sở 5 - Việt Trì",
  "Kiên Cường Auto Cơ Sở 6 - Bình Dương",
  "Kiên Cường Auto Cơ Sở 7 - Hương Canh",
];

const Overview = () => {
  const [cars, setCars] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/cars?branch=${encodeURIComponent(selectedBranch)}`
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
      await axios.delete(`/api/cars/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá xe: ", err);
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="p-4">
      {/* ⚠️ Lưu ý */}
      <div className="bg-yellow-100 text-red-800 border border-yellow-400 p-4 rounded-xl mb-6 text-sm leading-relaxed">
        <p className="font-bold underline mb-1">⚠️ Lưu ý quan trọng:</p>
        <ul className="list-disc pl-5">
          <li>Trang chỉnh sửa hiện tại <strong>không hỗ trợ chỉnh sửa ảnh</strong>. Nếu cần thay đổi ảnh, hãy xoá xe và thêm lại.</li>
          <li>Tuyệt đối <strong>không chỉnh sửa hoặc xoá xe thuộc cơ sở khác</strong> nếu không có sự cho phép.</li>
          <li>Hệ thống có thể ghi lại địa chỉ IP người dùng để xử lý sai phạm nếu có ảnh hưởng đến dữ liệu chung.</li>
        </ul>
      </div>

      {/* 🔘 Nút chọn chi nhánh */}
      <h3 className="text-lg font-semibold mb-2">Chọn chi nhánh:</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {branches.map((branch) => (
          <button
            key={branch}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedBranch === branch
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedBranch(branch)}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* ➕ Thêm xe */}
      <div className="mb-4">
        <Link to="/admin/add-car">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ➕ Thêm ô tô mới
          </button>
        </Link>
      </div>

      {/* 🚗 Danh sách xe */}
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : cars.length === 0 ? (
        <p className="text-gray-600">Không có xe nào thuộc cơ sở này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="border rounded-xl overflow-hidden shadow cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => navigate(`/cars/${car._id}`)}
            >
              <OptimizedImage
                src={car.images?.[0]?.url}
                alt={car.name}
                width={360}
                height={180}
                className="w-full h-60 object-cover rounded"
              />
              <div className="p-4 text-black">
                <h3 className="text-xl font-semibold">{car.name}</h3>
                <p className="text-red-800 font-bold text-lg my-2">
                  {car.price} triệu
                </p>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <div><strong>Năm:</strong> {car.year}</div>
                  <div><strong>Số:</strong> {car.gearbox}</div>
                  <div><strong>Km:</strong> {car.kilometers}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link to={`/admin/edit-car/${car._id}`}>
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded text-sm hover:bg-yellow-500">
                      ✏️ Sửa
                    </button>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Không trigger navigate
                      handleDelete(car._id);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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
