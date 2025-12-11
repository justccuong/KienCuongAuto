import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import OptimizedImage from "../../components/input/OptimizedImage";
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaArrowLeft, FaCheckCircle, 
  FaCogs, FaGasPump, FaRoad, FaCalendarAlt, FaCarSide,
  FaPalette, FaChair, FaDoorClosed, FaInfoCircle
} from "react-icons/fa";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [branch, setBranch] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/cars/detail/${id}`);
        const carData = res.data.car;
        setCar(carData);

        if (carData.branch) {
          const branchRes = await api.get(`/branches`);
          const foundBranch = branchRes.data.find(
            (b) => b.name === carData.branch
          );
          setBranch(foundBranch);
        }

        const relatedRes = await api.get(
          `/cars?branch=${encodeURIComponent(carData.branch || "")}`
        );
        const filtered = relatedRes.data.filter((c) => c._id !== carData._id);
        const randomCars = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelatedCars(randomCars);
      } catch (err) {
        console.error("❌ Lỗi khi fetch chi tiết xe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (thumbnailRefs.current[selectedImage]) {
      thumbnailRefs.current[selectedImage].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy xe!</h2>
        <button onClick={() => navigate("/find-car")} className="text-red-600 hover:underline">
          Quay lại tìm xe
        </button>
      </div>
    );
  }

  const hasImages = Array.isArray(car.images) && car.images.length > 0;

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- NÚT QUAY LẠI (TO RÕ, NẰM TRÊN CÙNG) --- */}
        <div className="mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-bold transition-colors text-lg group"
            >
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-red-50 transition-colors">
                    <FaArrowLeft className="text-sm" />
                </span>
                Quay lại danh sách
            </button>
        </div>

        {/* --- LAYOUT CHÍNH (2 Cột) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CỘT TRÁI: GALLERY ẢNH */}
          <div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
              {/* Ảnh chính */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group bg-gray-100">
                {hasImages ? (
                  <OptimizedImage
                    src={car.images[selectedImage]?.url}
                    alt={`${car.name} - Ảnh ${selectedImage + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Chưa có ảnh
                  </div>
                )}

                {/* Nút Next/Prev */}
                {hasImages && car.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10">
                      &#10094;
                    </button>
                    <button onClick={nextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10">
                      &#10095;
                    </button>
                  </>
                )}
                
                {/* Bộ đếm ảnh */}
                {hasImages && (
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {selectedImage + 1}/{car.images.length}
                    </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasImages && car.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 px-1 scrollbar-hide snap-x snap-mandatory">
                  {car.images.map((img, index) => (
                    <div
                      key={index}
                      ref={(el) => (thumbnailRefs.current[index] = el)}
                      className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all snap-center ${
                        selectedImage === index ? "border-red-600 opacity-100 ring-1 ring-red-200" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                       <OptimizedImage
                        src={img?.url}
                        alt="thumb"
                        width={80}
                        height={60}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="space-y-6">
            
            {/* Header Xe */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-600">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-3">
                    {car.name}
                </h1>
                <p className="text-3xl font-bold text-red-600 mb-4">
                    {car.price} <span className="text-lg text-gray-500 font-normal">Triệu</span>
                </p>
                
                <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-blue-100">
                        <FaCheckCircle /> {car.condition}
                    </span>
                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-green-100">
                        <FaCheckCircle /> {car.status}
                    </span>
                </div>
            </div>

            {/* Bảng Thông số */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <FaCogs className="text-red-500" /> Thông số kỹ thuật
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <InfoRow icon={<FaCalendarAlt />} label="Năm SX" value={car.year} />
                    <InfoRow icon={<FaRoad />} label="Odo" value={`${car.kilometers} km`} />
                    <InfoRow icon={<FaGasPump />} label="Nhiên liệu" value={car.fuel} />
                    <InfoRow icon={<FaCogs />} label="Hộp số" value={car.gearbox} />
                    <InfoRow icon={<FaCarSide />} label="Dẫn động" value={car.drive} />
                    <InfoRow icon={<FaPalette />} label="Màu sắc" value={car.color} />
                    <InfoRow icon={<FaChair />} label="Số ghế" value={car.seats} />
                    <InfoRow icon={<FaDoorClosed />} label="Số cửa" value={car.doors} />
                </div>
            </div>

            {/* Chi nhánh & Liên hệ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                        <FaMapMarkerAlt />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{car.branch || "Kiên Cường Auto"}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {branch?.location || "Vui lòng liên hệ để biết địa chỉ chính xác"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {branch?.hotline && (
                        <a href={`tel:${branch.hotline}`} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-200 hover:-translate-y-0.5">
                            <FaPhoneAlt className="animate-pulse" /> Gọi Ngay
                        </a>
                    )}
                    {branch?.socials?.zalo ? (
                        <a href={branch.socials.zalo} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                            Chat Zalo
                        </a>
                    ) : (
                        <button disabled className="bg-gray-200 text-gray-400 py-3 rounded-xl font-bold cursor-not-allowed">
                            Chưa có Zalo
                        </button>
                    )}
                </div>
            </div>

            {/* Mô tả (Nếu có) */}
            {car.description && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                        <FaInfoCircle className="text-blue-500" /> Mô tả chi tiết
                    </h3>
                    <div className="text-gray-700 text-sm leading-7 whitespace-pre-line text-justify font-normal bg-gray-50 p-4 rounded-xl border border-gray-200">
                        {car.description}
                    </div>
                </div>
            )}

          </div>
        </div>

        {/* --- XE TƯƠNG TỰ --- */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-red-600 pl-4">
            Gợi ý xe tương tự
          </h3>
          {relatedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCars.map(car => (
                    <Link to={`/cars/${car._id}`} key={car._id} onClick={() => window.scrollTo(0,0)} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <OptimizedImage src={car.images?.[0]?.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                {car.year}
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-gray-900 truncate mb-1 group-hover:text-red-600 transition-colors">{car.name}</h4>
                            <p className="text-red-600 font-extrabold text-lg">{car.price} Triệu</p>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500">
                                <FaMapMarkerAlt className="text-red-400" /> {car.branch}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 italic">Chưa có xe tương tự nào.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Component con hiển thị 1 dòng thông số
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors px-1 rounded">
        <div className="flex items-center gap-2.5 text-gray-500 group-hover:text-red-500 transition-colors">
            <span className="text-base">{icon}</span> 
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <span className="font-bold text-gray-900 truncate max-w-[55%] text-right">{value || "---"}</span>
    </div>
);