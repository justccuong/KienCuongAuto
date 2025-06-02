import React, { useState } from "react";

const OPTIONS = {
  status: ["Sẵn xe", "Hết hàng"],
  manufacturer: ["Ford", "Subaru", "Toyota", "Honda", "KIA"],
  color: ["Màu Trắng", "Màu Xanh", "Màu Đỏ", "Màu Đen"],
  drive: ["4 bánh toàn thời gian", "2 bánh trước", "2 bánh sau"],
  gearbox: ["Hộp số tự động", "Hộp số sàn"],
  condition: ["Xe mới", "Xe đã qua sử dụng"],
  fuel: ["Xăng", "Dầu", "Điện"],
  location: ["Showroom Hà Nội", "Showroom Bình Dương", "Showroom TP.HCM"],
  installment: [
    "Không hỗ trợ trả góp",
    "Chỉ cần trả trước khoảng 30-35% giá trị xe",
  ],
  quality: [
    "Khuyến khích khách hàng đưa xe đi check test ở gara uy tín",
    "Không có chính sách kiểm tra chất lượng",
  ],
};

const AddCarForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    manufacturer: "",
    color: "",
    drive: "",
    gearbox: "",
    condition: "",
    year: "",
    kilometers: "",
    fuel: "",
    doors: "",
    seats: "",
    engineCapacity: "",
    price: "",
    location: "",
    installment: "",
    quality: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["year", "kilometers", "doors", "seats", "engineCapacity", "price"];

    if (numberFields.includes(name)) {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status || !formData.manufacturer || !formData.price || !formData.year) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc: Trạng thái, Hãng sản xuất, Giá, Năm");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload thất bại");

      alert("Thêm xe thành công!");
      // Optionally reset form here
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Lỗi khi gửi dữ liệu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4 text-black">
      <h2 className="text-2xl font-bold mb-4">Form nhập thông tin xe</h2>
      <label className="block text-black">
        <span className="font-semibold">Tên xe:</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập tên xe"
          className="mt-1 block w-full p-2 border rounded bg-white text-black"
        />
      </label>

      <SelectInput label="Trạng thái" name="status" value={formData.status} options={OPTIONS.status} onChange={handleChange} />
      <SelectInput label="Hãng sản xuất" name="manufacturer" value={formData.manufacturer} options={OPTIONS.manufacturer} onChange={handleChange} />
      <SelectInput label="Màu sắc" name="color" value={formData.color} options={OPTIONS.color} onChange={handleChange} />
      <SelectInput label="Hệ dẫn động" name="drive" value={formData.drive} options={OPTIONS.drive} onChange={handleChange} />
      <SelectInput label="Hộp số" name="gearbox" value={formData.gearbox} options={OPTIONS.gearbox} onChange={handleChange} />
      <SelectInput label="Tình trạng" name="condition" value={formData.condition} options={OPTIONS.condition} onChange={handleChange} />

      <NumberInput label="Năm" name="year" value={formData.year} onChange={handleChange} />
      <NumberInput label="Kilometers (km)" name="kilometers" value={formData.kilometers} onChange={handleChange} />
      <SelectInput label="Nguyên liệu" name="fuel" value={formData.fuel} options={OPTIONS.fuel} onChange={handleChange} />
      <NumberInput label="Số cửa" name="doors" value={formData.doors} onChange={handleChange} />
      <NumberInput label="Số ghế" name="seats" value={formData.seats} onChange={handleChange} />
      <NumberInput label="Dung tích động cơ (L)" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} />
      <NumberInput label="Giá (Triệu VND)" name="price" value={formData.price} onChange={handleChange} />

      <SelectInput label="Địa điểm" name="location" value={formData.location} options={OPTIONS.location} onChange={handleChange} />
      <SelectInput label="Trả góp" name="installment" value={formData.installment} options={OPTIONS.installment} onChange={handleChange} />
      <SelectInput label="Chất lượng" name="quality" value={formData.quality} options={OPTIONS.quality} onChange={handleChange} />

      <div>
        <label className="block text-black font-semibold">Ảnh xe:</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-2 block"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt="Preview" className="w-24 h-24 object-cover border rounded" />
          ))}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Thêm xe
      </button>
    </form>
  );
};

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

const NumberInput = ({ label, name, value, onChange }) => (
  <label className="block text-black">
    <span className="font-semibold">{label}:</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Nhập ${label.toLowerCase()}`}
      className="mt-1 block w-full p-2 border rounded bg-white text-black"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  </label>
);

export default AddCarForm;

