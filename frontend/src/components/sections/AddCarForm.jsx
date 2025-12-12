import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import SearchableSelect from "../../components/input/SearchableSelect";
import ColorSelect from "../../components/input/ColorSelect";

const OPTIONS = {
  status: ["Sẵn xe", "Hết hàng"],
  manufacturer: [
    "Ford", "Vinfast", "Subaru", "Toyota", "Honda", "KIA", "Hyundai", "Mazda",
    "Nissan", "Suzuki", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Lexus",
    "Mitsubishi", "Isuzu", "Chevrolet", "Daehan", "Dongfeng", "Foton", "Hino",
    "JAC", "Jeep", "Land Rover", "MG", "Mini", "Peugeot", "Porsche", "Renault",
    "Skoda", "SsangYong", "Tata",
  ],
  color: [
    "Màu Trắng", "Màu Đen", "Màu Xám (Grey)", "Màu Bạc (Silver)",
    "Màu Đỏ", "Màu Đỏ Đô", "Màu Cam", "Màu Vàng", "Màu Vàng Cát", "Màu Vàng Đồng", 
    "Màu Champagne", "Màu Be (Beige)",
    "Màu Xanh (Blue)", "Màu Xanh Đen (Cavansite)", "Màu Xanh Lá", "Màu Xanh Ngọc", "Màu Xanh Rêu",
    "Màu Nâu (Cafe)", "Màu Nâu Đất", "Màu Tím", "Màu Hồng", "Màu Titan",
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
    "Kiên Cường Auto Cơ Sở 6 - Bình Xuyên",
  ],
  installment: ["Không hỗ trợ trả góp", "Hỗ trợ trả góp lên tới 70% giá trị xe"],
  quality: ["Khuyến khích khách hàng đưa xe đi check test ở gara uy tín", "Không có chính sách kiểm tra chất lượng"],
};

const AddCarForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", status: "", manufacturer: "", color: "", drive: "", gearbox: "",
    condition: "", year: "", kilometers: "", fuel: "", doors: "", seats: "",
    engineCapacity: "", price: "", branch: "", installment: "", quality: "",
    description: "",
  });

  const [images, setImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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
    if (files.length === 0) return;
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previewImages[indexToRemove]);
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status || !formData.manufacturer || !formData.price || !formData.year || !formData.branch) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc (Trạng thái, Hãng, Giá, Năm, Chi nhánh)");
      return;
    }

    if (images.length === 0) {
        alert("Chưa chọn ảnh nào cho xe!");
        return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    images.forEach((img) => data.append("images", img));

    try {
      await api.post("/cars", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🎉 Thêm xe thành công!");
      navigate("/admin");

    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("❌ Lỗi khi thêm xe: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 text-gray-700 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <TextInput label="Tên xe (Tiêu đề)" name="name" value={formData.name} onChange={handleChange} />
        </div>
        
        <SearchableSelect label="Hãng sản xuất" name="manufacturer" value={formData.manufacturer} options={OPTIONS.manufacturer} onChange={handleChange} /> 
        <NumberInput label="Giá bán (Triệu VND) *" name="price" value={formData.price} onChange={handleChange} />
        
        <SelectInput label="Chi nhánh *" name="branch" value={formData.branch} options={OPTIONS.branch} onChange={handleChange} />
        <SelectInput label="Trạng thái *" name="status" value={formData.status} options={OPTIONS.status} onChange={handleChange} />
        
        <NumberInput label="Năm sản xuất *" name="year" value={formData.year} onChange={handleChange} />
        <NumberInput label="Odo (Km)" name="kilometers" value={formData.kilometers} onChange={handleChange} />

        <ColorSelect label="Màu sắc ngoại thất" name="color" value={formData.color} options={OPTIONS.color} onChange={handleChange} />
        <SelectInput label="Hộp số" name="gearbox" value={formData.gearbox} options={OPTIONS.gearbox} onChange={handleChange} />
        
        <SelectInput label="Nhiên liệu" name="fuel" value={formData.fuel} options={OPTIONS.fuel} onChange={handleChange} />
        <SelectInput label="Dẫn động" name="drive" value={formData.drive} options={OPTIONS.drive} onChange={handleChange} />
        
        <SelectInput label="Tình trạng" name="condition" value={formData.condition} options={OPTIONS.condition} onChange={handleChange} />
        <NumberInput label="Dung tích động cơ (L)" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} />
        
        <div className="grid grid-cols-2 gap-4">
             <NumberInput label="Số ghế" name="seats" value={formData.seats} onChange={handleChange} />
             <NumberInput label="Số cửa" name="doors" value={formData.doors} onChange={handleChange} />
        </div>
        
        <div className="md:col-span-2">
            <SelectInput label="Chính sách trả góp" name="installment" value={formData.installment} options={OPTIONS.installment} onChange={handleChange} />
        </div>
        <div className="md:col-span-2">
            <SelectInput label="Cam kết chất lượng" name="quality" value={formData.quality} options={OPTIONS.quality} onChange={handleChange} />
        </div>

        <div className="md:col-span-2 pt-4 border-t border-gray-100">
            <label className="block text-gray-700 font-semibold text-sm mb-2">Mô tả chi tiết</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Nhập mô tả chi tiết về xe (tình trạng, trang bị, lịch sử bảo dưỡng...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
            />
        </div>
      </div>

      <div>
        <span className="block font-semibold text-gray-700 mb-2">Hình ảnh xe:</span>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fas fa-cloud-upload-alt text-3xl text-blue-500 mb-2"></i>
                <p className="text-sm text-gray-500 font-semibold">Bấm vào đây để chọn ảnh</p>
                <p className="text-xs text-gray-400">(Hỗ trợ JPG, PNG, JPEG)</p>
            </div>
            <input 
                type="file" 
                name="images" 
                accept="image/*" 
                multiple 
                onChange={handleImageChange} 
                className="hidden" 
            />
        </label>

        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative group w-full h-24">
                  <img 
                    src={src} 
                    alt={`Preview ${index}`} 
                    className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-transform transform hover:scale-110"
                    title="Xóa ảnh này"
                  >
                    <i className="fas fa-times"></i>
                  </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
      >
        {loading ? (
            <span><i className="fas fa-spinner fa-spin mr-2"></i> Đang xử lý...</span>
        ) : (
            <span>➕ Đăng bán xe ngay</span>
        )}
      </button>
    </form>
  );
};

const TextInput = ({ label, name, value, onChange }) => (
  <label className="block text-gray-700">
    <span className="font-semibold text-sm mb-1 block">{label}</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder="..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
    />
  </label>
);

const NumberInput = TextInput;

const SelectInput = ({ label, name, value, options, onChange }) => (
  <label className="block text-gray-700">
    <span className="font-semibold text-sm mb-1 block">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
    >
      <option value="">-- Chọn --</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default AddCarForm;