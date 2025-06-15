import React, { useState } from "react";

const OPTIONS = {
  status: ["Sẵn xe", "Hết hàng"],
  manufacturer: [
    "Ford",
    "Vinfast",
    "Subaru",
    "Toyota",
    "Honda",
    "KIA",
    "Hyundai",
    "Mazda",
    "Nissan",
    "Suzuki",
    "Volkswagen",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Lexus",
    "Mitsubishi",
    "Isuzu",
    "Chevrolet",
    "Daehan",
    "Dongfeng",
    "Foton",
    "Hino",
    "JAC",
    "Jeep",
    "Land Rover",
    "MG",
    "Mini",
    "Peugeot",
    "Porsche",
    "Renault",
    "Skoda",
    "SsangYong",
    "Tata",
  ],
  color: [
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
    branch: "",
    installment: "",
    quality: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = [
      "year",
      "kilometers",
      "doors",
      "seats",
      "engineCapacity",
      "price",
    ];

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

    console.log(formData); 

    try {
      const res = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload thất bại");

      alert("Thêm xe thành công!");
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Lỗi khi gửi dữ liệu");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4 text-black"
    >
      <h2 className="text-2xl font-bold mb-4">Form nhập thông tin xe</h2>

      <TextInput label="Tên xe" name="name" value={formData.name} onChange={handleChange} />
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
      <SelectInput label="Chi nhánh" name="branch" value={formData.branch} options={OPTIONS.branch} onChange={handleChange} />
      <SelectInput label="Trả góp" name="installment" value={formData.installment} options={OPTIONS.installment} onChange={handleChange} />
      <SelectInput label="Chất lượng" name="quality" value={formData.quality} options={OPTIONS.quality} onChange={handleChange} />

      <div>
        <label className="block text-black font-semibold">Ảnh xe:</label>
        <input type="file" name="images" accept="image/*" multiple onChange={handleImageChange} className="mt-2 block" />
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

const NumberInput = TextInput;

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

export default AddCarForm;
