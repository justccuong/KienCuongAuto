import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/axios";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [branch, setBranch] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/detail/${id}`);
        const carData = res.data.car;
        setCar(carData);

        // 🔗 Fetch branch by car.branch name
        const branchRes = await api.get(`/branches`);
        const foundBranch = branchRes.data.find(
          (b) => b.name === carData.branch
        );
        setBranch(foundBranch);

        // 🔗 Fetch related cars in same branch
        const relatedRes = await api.get(
          `/cars?branch=${encodeURIComponent(carData.branch)}`
        );
        const filtered = relatedRes.data.filter((c) => c._id !== carData._id);
        const randomCars = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedCars(randomCars);
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
    return (
      <div className="p-6 text-center text-gray-500">
        Không tìm thấy xe có ID: {id}
      </div>
    );
  }

  const hasImages = Array.isArray(car.images) && car.images.length > 0;

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* LEFT: IMAGE */}
        <div>
          <div className="relative rounded-lg overflow-hidden shadow">
            {hasImages ? (
              <img
                src={car.images[selectedImage]?.url || "/images/no-image.jpg"}
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
                  ref={(el) => (thumbnailRefs.current[index] = el)}
                  src={img?.url || "/images/no-image.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-14 object-cover rounded border-2 cursor-pointer flex-shrink-0 ${
                    selectedImage === index
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold mt-6">{car.name}</h2>
        </div>

        {/* RIGHT: INFO */}
        <div className="space-y-4 text-sm">
          <div className="bg-white shadow rounded-2xl p-6 grid grid-cols-2 gap-2">
            <span className="font-semibold">Năm:</span>
            <span>{car.year}</span>
            <span className="font-semibold">Số km:</span>
            <span>{car.kilometers}</span>
            <span className="font-semibold">Nhiên liệu:</span>
            <span>{car.fuel}</span>
            <span className="font-semibold">Giá:</span>
            <span>{car.price} triệu ₫</span>
            <span className="font-semibold">Trạng thái:</span>
            <span>{car.status}</span>
            <span className="font-semibold">Hãng:</span>
            <span>{car.manufacturer}</span>
            <span className="font-semibold">Màu:</span>
            <span>{car.color}</span>
            <span className="font-semibold">Dẫn động:</span>
            <span>{car.drive}</span>
            <span className="font-semibold">Hộp số:</span>
            <span>{car.gearbox}</span>
            <span className="font-semibold">Tình trạng:</span>
            <span>{car.condition}</span>
            <span className="font-semibold">Số cửa:</span>
            <span>{car.doors}</span>
            <span className="font-semibold">Số ghế:</span>
            <span>{car.seats}</span>

            {branch?.hotline && (
              <>
                <span className="font-semibold">Hotline chi nhánh:</span>
                <span className="text-blue-600">{branch.hotline}</span>
              </>
            )}
          </div>

          {/* Zalo */}
          {branch?.socials?.zalo ? (
            <a
              href={branch.socials.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow"
            >
              Liên hệ qua Zalo
            </a>
          ) : (
            <button className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl shadow cursor-not-allowed">
              Chưa có link Zalo
            </button>
          )}

          {/* Nút gọi */}
          {branch?.hotline && (
            <a
              href={`tel:${branch.hotline}`}
              className="block text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow"
            >
               Gọi ngay {branch.hotline}
            </a>
          )}
        </div>
      </div>

      {/* RELATED */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-xl font-semibold mb-4">Xe tương tự</h3>
        {relatedCars.length === 0 ? (
          <div className="text-gray-500 italic">Không tìm thấy xe tương tự.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedCars.map((relatedCar) => {
              // 🔗 Tìm branch cho từng xe tương tự
              const branchInfo = branch && branch.name === relatedCar.branch
                ? branch
                : null;

              return (
                <Link
                  key={relatedCar._id}
                   onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  to={`/cars/${relatedCar._id}`}
                  className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition block"
                >
                  <img
                    src={relatedCar.images?.[0]?.url || "/images/no-image.jpg"}
                    alt={relatedCar.name}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <h4 className="text-lg font-semibold">{relatedCar.name}</h4>
                    <p className="text-sm text-gray-500">
                      {relatedCar.year} • {relatedCar.kilometers} km
                    </p>
                    <p className="text-red-600 font-bold">
                      {relatedCar.price} triệu ₫
                    </p>
                    <span className="block text-sm text-gray-600">
                      📍 {relatedCar.branch}
                    </span>
                    {branchInfo?.hotline && (
                      <span className="block text-sm text-blue-600">
                        ☎ {branchInfo.hotline}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
