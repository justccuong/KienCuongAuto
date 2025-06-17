import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useParams } from "react-router-dom";

const OPTIONS = {
  status: ["Sẵn xe", "Hết hàng"],
  manufacturer: [
    "Ford", "Vinfast", "Subaru", "Toyota", "Honda", "KIA", "Hyundai", "Mazda", "Nissan", "Suzuki", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Mitsubishi", "Isuzu", "Chevrolet", "Daehan", "Dongfeng", "Foton", "Hino", "JAC", "Jeep", "Land Rover", "MG", "Mini", "Peugeot", "Porsche", "Renault", "Skoda", "SsangYong", "Tata",
  ],
  color: [
    "⚪ Màu Trắng", "🔵 Màu Xanh", "🔴 Màu Đỏ", "⚫ Màu Đen", "🔘 Màu Xám", "🖤 Màu Bạc", "🟡 Màu Vàng", "🟠 Màu Cam", "🟤 Màu Nâu", "🟣 Màu Tím", "🌸 Màu Hồng",
  ],
  drive: ["4 bánh toàn thời gian", "2 bánh trước", "2 bánh sau"],
  gearbox: ["Hộp số tự động", "Hộp số sàn"],
  condition: ["Xe mới", "Xe đã qua sử dụng"],
  fuel: ["Xăng", "Dầu", "Điện"],
  branch: [
    "Trụ sở chính Kiên Cường Auto",
    "Kiên Cường Auto Cơ Sở 1",
    "Kiên Cường Auto Cơ Sở 2",
    "Kiên Cường Auto Cơ Sở 4 - Tuyên Quang",
    "Kiên Cường Auto Cơ Sở 5 - Việt Trì",
    "Kiên Cường Auto Cơ Sở 6 - Bình Dương",
    "Kiên Cường Auto Cơ Sở 7 - Hương Canh",
  ],
  installment: [
    "Không hỗ trợ trả góp",
    "Hỗ trợ trả góp lên tới 70% giá trị xe",
  ],
  quality: [
    "Khuyến khích khách hàng đưa xe đi check test ở gara uy tín",
    "Không có chính sách kiểm tra chất lượng",
  ],
};

const EditCarForm = () => {
  const { carId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true); // giống như ở overview

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/detail/${carId}`);
        setFormData(res.data.car); // giống AdminOverview
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết xe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/cars/${carId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Cập nhật thành công");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Cập nhật thất bại");
    }
  };

  if (!formData) return <p>Đang tải...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4 text-black">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin xe</h2>
      <TextInput label="Tên xe" name="name" value={formData.name} onChange={handleChange} />
      <SelectInput label="Trạng thái" name="status" value={formData.status} options={OPTIONS.status} onChange={handleChange} />
      <SelectInput label="Hãng sản xuất" name="manufacturer" value={formData.manufacturer} options={OPTIONS.manufacturer} onChange={handleChange} />
      <SelectInput label="Màu sắc" name="color" value={formData.color} options={OPTIONS.color} onChange={handleChange} />
      <SelectInput label="Hệ dẫn động" name="drive" value={formData.drive} options={OPTIONS.drive} onChange={handleChange} />
      <SelectInput label="Hộp số" name="gearbox" value={formData.gearbox} options={OPTIONS.gearbox} onChange={handleChange} />
      <SelectInput label="Tình trạng" name="condition" value={formData.condition} options={OPTIONS.condition} onChange={handleChange} />
      <TextInput label="Năm" name="year" value={formData.year} onChange={handleChange} />
      <TextInput label="Kilometers (km)" name="kilometers" value={formData.kilometers} onChange={handleChange} />
      <SelectInput label="Nguyên liệu" name="fuel" value={formData.fuel} options={OPTIONS.fuel} onChange={handleChange} />
      <TextInput label="Số cửa" name="doors" value={formData.doors} onChange={handleChange} />
      <TextInput label="Số ghế" name="seats" value={formData.seats} onChange={handleChange} />
      <TextInput label="Dung tích động cơ (L)" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} />
      <TextInput label="Giá (Triệu VND)" name="price" value={formData.price} onChange={handleChange} />
      <SelectInput label="Chi nhánh" name="branch" value={formData.branch} options={OPTIONS.branch} onChange={handleChange} />
      <SelectInput label="Trả góp" name="installment" value={formData.installment} options={OPTIONS.installment} onChange={handleChange} />
      <SelectInput label="Chất lượng" name="quality" value={formData.quality} options={OPTIONS.quality} onChange={handleChange} />
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Lưu thay đổi
      </button>
    </form>
  );
};

const TextInput = ({ label, name, value, onChange }) => (
  <label className="block text-black">
    <span className="font-semibold">{label}:</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Nhập ${label.toLowerCase()}`}
      className="mt-1 block w-full p-2 border rounded bg-white text-black"
    />
  </label>
);

const SelectInput = ({ label, name, value, options, onChange }) => (
  <label className="block text-black">
    <span className="font-semibold">{label}:</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-1 block w-full p-2 border rounded bg-white text-black"
    >
      <option value="">-- Chọn {label.toLowerCase()} --</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default EditCarForm;
