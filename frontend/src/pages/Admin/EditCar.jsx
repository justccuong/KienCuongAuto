import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
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

const EditCarForm = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/detail/${carId}`);
        const data = res.data.car;
        if (!data.description) data.description = ""; 
        setFormData(data);
      } catch (err) {
        console.error("Lỗi khi fetch chi tiết xe:", err);
        alert("Không tìm thấy thông tin xe!");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/cars/${carId}`, formData);
      alert("✅ Cập nhật thông tin xe thành công!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("❌ Cập nhật thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <i className="fas fa-circle-notch fa-spin text-4xl text-red-600"></i>
        <p className="mt-3 text-gray-500 font-medium">Đang tải dữ liệu xe...</p>
      </div>
    </div>
  );

  if (!formData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors font-semibold group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-red-50 transition-colors border border-gray-200">
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-0.5 transition-transform"></i>
          </div>
          Quay lại danh sách
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="px-8 py-6 border-b border-gray-100 bg-white">
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-red-100 text-red-600 p-2 rounded-lg text-xl">
                  <i className="fas fa-edit"></i>
                </span>
                Chỉnh sửa thông tin xe
             </h1>
             <p className="text-gray-500 text-sm mt-2 ml-11">
                Cập nhật thông tin chi tiết cho xe mã: <span className="font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{carId}</span>
             </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div className="md:col-span-2">
                  <TextInput label="Tên xe (Tiêu đề hiển thị)" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="md:col-span-2 pt-2 pb-1 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-l-4 border-red-500 pl-2">1. Thông tin cơ bản</h3>
              </div>
              <SearchableSelect label="Hãng sản xuất" name="manufacturer" value={formData.manufacturer} options={OPTIONS.manufacturer} onChange={handleChange} /> 
              <TextInput label="Giá bán (Triệu VND)" name="price" value={formData.price} onChange={handleChange} />
              
              <SelectInput label="Chi nhánh quản lý" name="branch" value={formData.branch} options={OPTIONS.branch} onChange={handleChange} />
              <SelectInput label="Trạng thái kho" name="status" value={formData.status} options={OPTIONS.status} onChange={handleChange} />
              
              <TextInput label="Năm sản xuất" name="year" value={formData.year} onChange={handleChange} />
              <TextInput label="Odo (Km)" name="kilometers" value={formData.kilometers} onChange={handleChange} />

              <div className="md:col-span-2 pt-4 pb-1 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-l-4 border-red-500 pl-2">2. Thông số kỹ thuật</h3>
              </div>
              
              <ColorSelect label="Màu sắc ngoại thất" name="color" value={formData.color} options={OPTIONS.color} onChange={handleChange} />
              <SelectInput label="Hộp số" name="gearbox" value={formData.gearbox} options={OPTIONS.gearbox} onChange={handleChange} />
              
              <SelectInput label="Nhiên liệu" name="fuel" value={formData.fuel} options={OPTIONS.fuel} onChange={handleChange} />
              <SelectInput label="Hệ dẫn động" name="drive" value={formData.drive} options={OPTIONS.drive} onChange={handleChange} />
              
              <SelectInput label="Tình trạng xe" name="condition" value={formData.condition} options={OPTIONS.condition} onChange={handleChange} />
              <TextInput label="Dung tích động cơ (L)" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} />
              
              <div className="grid grid-cols-2 gap-4">
                   <TextInput label="Số ghế" name="seats" value={formData.seats} onChange={handleChange} />
                   <TextInput label="Số cửa" name="doors" value={formData.doors} onChange={handleChange} />
              </div>
              
              <div className="md:col-span-2 pt-4 pb-1 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-l-4 border-red-500 pl-2">3. Chính sách bán hàng</h3>
              </div>

              <div className="md:col-span-2">
                  <SelectInput label="Hỗ trợ trả góp" name="installment" value={formData.installment} options={OPTIONS.installment} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                  <SelectInput label="Cam kết chất lượng" name="quality" value={formData.quality} options={OPTIONS.quality} onChange={handleChange} />
              </div>

              <div className="md:col-span-2 pt-4 pb-1 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-l-4 border-red-500 pl-2">4. Mô tả chi tiết</h3>
              </div>
              <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold text-sm mb-2 group-hover:text-red-600 transition-colors">Mô tả & Ghi chú</label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Nhập mô tả chi tiết về xe..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all placeholder-gray-300 resize-y"
                  />
              </div>

            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-100">
              <Link 
                  to="/admin"
                  className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all hover:shadow-md"
              >
                  Hủy bỏ
              </Link>
              <button 
                  type="submit" 
                  disabled={saving}
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-red-200 transition-all transform hover:-translate-y-1 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'}`}
              >
                  {saving ? (
                      <span><i className="fas fa-spinner fa-spin mr-2"></i> Đang lưu...</span>
                  ) : (
                      <span><i className="fas fa-save mr-2"></i> Lưu thay đổi</span>
                  )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TextInput = ({ label, name, value, onChange, required }) => (
  <label className="block text-gray-700 group">
    <span className="font-semibold text-sm mb-1.5 block group-hover:text-red-600 transition-colors">{label}</span>
    <input
      type="text"
      name={name}
      value={value || ""} 
      onChange={onChange}
      required={required}
      placeholder="..."
      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all placeholder-gray-300"
    />
  </label>
);

const SelectInput = ({ label, name, value, options, onChange }) => (
  <label className="block text-gray-700 group">
    <span className="font-semibold text-sm mb-1.5 block group-hover:text-red-600 transition-colors">{label}</span>
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        required
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none appearance-none transition-all cursor-pointer"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
        <i className="fas fa-chevron-down text-xs group-hover:text-red-500"></i>
      </div>
    </div>
  </label>
);

export default EditCarForm;