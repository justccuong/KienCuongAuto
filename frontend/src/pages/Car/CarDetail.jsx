import { useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars/detail/${id}`);
        setCar(res.data.car);
      } catch (err) {
        console.error("❌ Lỗi khi fetch chi tiết xe:", err);
      }
    };

    fetchCar();
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

  if (!car) {
    return <div className="p-6 text-center text-gray-500">Không tìm thấy xe có ID: {id}</div>;
  }

  const hasImages = Array.isArray(car.images) && car.images.length > 0;

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* LEFT: IMAGE SECTION */}
        <div>
          <div className="relative rounded-lg overflow-hidden shadow">
            {hasImages ? (
              <img
                src={car.images[selectedImage]}
                alt={`Image ${selectedImage + 1}`}
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
                Không có ảnh
              </div>
            )}

            {hasImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>

          {hasImages && (
  <div className="flex gap-4 mt-4 overflow-x-auto max-w-[480px] mx-auto">
    {car.images.map((img, index) => (
      <img
        key={index}
        ref={(el) => (thumbnailRefs.current[index] = el)} // 💥 gán ref
        src={img}
        alt={`Thumbnail ${index + 1}`}
        className={`w-20 h-14 object-cover rounded border-2 cursor-pointer flex-shrink-0 ${
          selectedImage === index ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setSelectedImage(index)}
      />
    ))}
  </div>
)}
          <h2 className="text-2xl font-bold mt-6">{car.name}</h2>
        </div>

        {/* RIGHT: INFO SECTION */}
        <div className="space-y-4 text-sm">
          <div className="bg-white shadow rounded-2xl p-6 grid grid-cols-2 gap-2">
            <span className="font-semibold">Năm:</span><span>{car.year}</span>
            <span className="font-semibold">Số km:</span><span>{car.kilometers}</span>
            <span className="font-semibold">Loại xe:</span><span>{car.type}</span>
            <span className="font-semibold">Nhiên liệu:</span><span>{car.fuel}</span>
            <span className="font-semibold">Giá:</span><span>{car.price}</span>
            <span className="font-semibold">Trạng thái:</span><span>{car.status}</span>
            <span className="font-semibold">Hãng:</span><span>{car.brand}</span>
            <span className="font-semibold">Màu:</span><span>{car.color}</span>
            <span className="font-semibold">Hệ dẫn động:</span><span>{car.drive}</span>
            <span className="font-semibold">Hộp số:</span><span>{car.gearbox}</span>
            <span className="font-semibold">Tình trạng:</span><span>{car.condition}</span>
            <span className="font-semibold">Số cửa:</span><span>{car.doors}</span>
            <span className="font-semibold">Số ghế:</span><span>{car.seats}</span>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow">
            Chat với Tư vấn viên
          </button>
        </div>
      </div>

      {/* SIMILAR CARS */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-xl font-semibold mb-4">Xe tương tự</h3>
        <div className="text-gray-500 italic">Đang cập nhật...</div>
      </div>
    </div>
  );
}
