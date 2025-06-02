import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaTiktok,
  FaComments
} from "react-icons/fa";

// Dữ liệu chi nhánh (có thể load từ backend nếu cần mở rộng)
const branches = [
  {
    id: "tru-so-chinh",
    name: "Trụ sở chính Kiên Cường Auto",
    location: "771 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0966812888",
    image: "/anh-co-so/truso.jpg",
    description:
      "Trụ sở chính với không gian rộng lớn, chuyên cung cấp các dòng xe cao cấp.",
    mapsUrl: "https://maps.app.goo.gl/z6Lv2w4S8VkKAHHA9",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.876167948284!2d105.6574498!3d21.258984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fb470524de59%3A0x83213dd31a47e656!2zT-G7kSBUw6ogS2nhu4FuIEPGoW5nIFbDrG5oIFBow7pj!5e0!3m2!1svi!2s!4v1717220582345!5m2!1svi!2s",
    socials: {
      facebook: "https://facebook.com/kiencuongauto",
      tiktok: "https://www.tiktok.com/@kiencuongauto",
      zalo: "https://zalo.me/0966812888"
    }
  }
  // Thêm chi nhánh khác nếu cần
];

const BranchDetail = () => {
  const { id } = useParams();
  const branch = branches.find((b) => b.id === id);
  const [cars, setCars] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xe:", error);
      }
    };

    fetchCars();
  }, []);

  if (!branch)
    return (
      <div className="text-center text-red-600 mt-10">
        Không tìm thấy chi nhánh!
      </div>
    );

  return (
    <section className="bg-white min-h-screen text-black py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/branches"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Quay lại danh sách chi nhánh
        </Link>

        <img
          src={branch.image}
          alt={branch.name}
          className="w-full h-64 object-cover rounded-2xl mb-6 shadow"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{branch.name}</h1>
        <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
          <FaMapMarkerAlt />
          {branch.location}
        </p>
        <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
          <FaPhoneAlt />
          {branch.hotline}
        </p>
        <p className="text-gray-600 mt-4">{branch.description}</p>

        {/* Mạng xã hội */}
        <div className="flex items-center gap-6 mt-6 text-2xl">
          {branch.socials.facebook && (
            <a
              href={branch.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaFacebook />
            </a>
          )}
          {branch.socials.tiktok && (
            <a
              href={branch.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800"
            >
              <FaTiktok />
            </a>
          )}
          {branch.socials.zalo && (
            <a
              href={branch.socials.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaComments />
            </a>
          )}
        </div>

        {/* Danh sách xe */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Xe đang bán</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              Tất cả
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              SUV
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              Sedan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="border rounded-xl overflow-hidden shadow cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => navigate(`/cars/${car._id}`)}
              >
                <img
                  src={car.images?.[0]}
                  alt={car.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-black">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <p className="text-red-800 font-bold text-lg my-2">
                    {car.price}
                  </p>
                  <div className="flex justify-between text-sm text-gray-700 mt-4">
                    <div>
                      <span className="font-semibold">Năm:</span> {car.year}
                    </div>
                    <div>
                      <span className="font-semibold">Số:</span> {car.gearbox}
                    </div>
                    <div>
                      <span className="font-semibold">Km:</span>{" "}
                      {car.kilometers}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bản đồ */}
        {branch.mapsUrl && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
            <a
              href={branch.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
            >
              🚗 Dẫn tôi tới cửa hàng
            </a>
            <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
              <iframe
                src={branch.mapsEmbed}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                title="Google Map"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchDetail;
