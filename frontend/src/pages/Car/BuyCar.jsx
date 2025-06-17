import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const OPTIONS = {
  status: {
    label: "Tình trạng xe",
    values: ["Sẵn xe", "Hết hàng"],
  },
  manufacturer: {
    label: "Hãng xe",
    values: [
      "Ford", "Vinfast", "Subaru", "Toyota", "Honda", "KIA", "Hyundai", "Mazda",
      "Nissan", "Suzuki", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Lexus",
      "Mitsubishi", "Isuzu", "Chevrolet", "Daehan", "Dongfeng", "Foton", "Hino",
      "JAC", "Jeep", "Land Rover", "MG", "Mini", "Peugeot", "Porsche", "Renault",
      "Skoda", "SsangYong", "Tata",
    ],
  },
  color: {
    label: "Màu sắc",
    values: [
      "⚪ Màu Trắng",
    "🔵 Màu Xanh",
    "🔴 Màu Đỏ",
    "⚫ Màu Đen",
    "🔘 Màu Xám",
    "🩶 Màu Bạc",
    "🟡 Màu Vàng",
    "🟠 Màu Cam",
    "🟤 Màu Nâu",
    "🟣 Màu Tím",
    "🌸 Màu Hồng",
    ],
  },
  drive: {
    label: "Dẫn động",
    values: ["4 bánh toàn thời gian", "2 bánh trước", "2 bánh sau"],
  },
  gearbox: {
    label: "Hộp số",
    values: ["Hộp số tự động", "Hộp số sàn"],
  },
  condition: {
    label: "Tình trạng sử dụng",
    values: ["Xe mới", "Xe đã qua sử dụng"],
  },
  fuel: {
    label: "Nhiên liệu",
    values: ["Xăng", "Dầu", "Điện"],
  },
  branch: {
    label: "Cơ sở",
    values: [
      "Trụ sở chính Kiên Cường Auto",
      "Kiên Cường Auto Cơ Sở 1",
      "Kiên Cường Auto Cơ Sở 2",
      "Kiên Cường Auto Cơ Sở 4 - Tuyên Quang",
      "Kiên Cường Auto Cơ Sở 5 - Việt Trì",
      "Kiên Cường Auto Cơ Sở 6 - Bình Dương",
      "Kiên Cường Auto Cơ Sở 7 - Hương Canh",
    ],
  },
  installment: {
    label: "Trả góp",
    values: [
      "Không hỗ trợ trả góp",
    "Hỗ trợ trả góp lên tới 70% giá trị xe",
    ],
  },
  quality: {
    label: "Chính sách kiểm tra",
    values: [
      "Khuyến khích khách hàng đưa xe đi check test ở gara uy tín",
    "Không có chính sách kiểm tra chất lượng",
    ],
  },
};

const FindCarPage = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get("/api/cars", { params: filters });
        const filtered = res.data.filter((car) => {
          const matchesSearch = Object.values(car).join(" ").toLowerCase().includes(search.toLowerCase());
          const matchesMinPrice = minPrice ? car.price >= parseInt(minPrice) : true;
          const matchesMaxPrice = maxPrice ? car.price <= parseInt(maxPrice) : true;
          return matchesSearch && matchesMinPrice && matchesMaxPrice;
        });
        setCars(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu xe:", err);
      }
    };
    fetchCars();
  }, [filters, search, minPrice, maxPrice]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tìm mua ô tô</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(OPTIONS).map(([key, { label, values }]) => (
            <select
                key={key}
                className="border p-2 rounded"
                value={filters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
            >
                <option value="">{`Chọn ${label}`}</option>
                {values.map((option) => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            ))}

        <input
          type="number"
          placeholder="Giá từ (triệu)"
          className="border p-2 rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Giá đến (triệu)"
          className="border p-2 rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-3 pl-10 rounded w-full text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Link
            to={`/cars/${car._id}`}
            key={car._id}
            className="border rounded p-4 shadow hover:scale-105 transform transition-all duration-200 block"
            >
            <img
                src={car.images?.[0]?.url || "/placeholder.png"}
                alt={car.name}
                className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-xl mb-1">{car.name}</h2>
            <p className="text-red-600 font-bold text-lg">{car.price} triệu</p>
            <p className="text-sm text-gray-500">{car.branch}</p>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default FindCarPage;