import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OptimizedImage from "../../components/input/OptimizedImage";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaTiktok,
  FaComments
} from "react-icons/fa";

const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("/api/branches");
        setBranches(res.data);

        const matched = res.data.find((b) => b.id === id);
        setBranch(matched);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách chi nhánh:", err);
      }
    };

    fetchBranches();
  }, [id]);

  useEffect(() => {
    const fetchCars = async () => {
      if (!branch?.name) return;
      try {
        const res = await axios.get(`/api/cars?branch=${encodeURIComponent(branch.name)}`);
        setCars(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách xe:", error);
      }
    };

    fetchCars();
  }, [branch]);

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

        <div className="flex items-center gap-6 mt-6 text-2xl">
          {branch.socials?.facebook && (
            <a href={branch.socials.facebook} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900">
              <FaFacebook />
            </a>
          )}
          {branch.socials?.tiktok && (
            <a href={branch.socials.tiktok} target="_blank" rel="noreferrer" className="text-black hover:text-gray-800">
              <FaTiktok />
            </a>
          )}
          {branch.socials?.zalo && (
            <a href={branch.socials.zalo} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
              <FaComments />
            </a>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Xe đang bán</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.length > 0 ? (
              cars.map((car) => (
                <div
                  key={car._id}
                  className="border rounded-xl overflow-hidden shadow cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  onClick={() => navigate(`/cars/${car._id}`)}
                >
                  <OptimizedImage
                    src={car.images?.[0]?.url}
                    alt={car.name}
                    width={360}
                    height={180}
                    className="w-full h-60 object-cover rounded"
                  />
                  <div className="p-4 text-black">
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <p className="text-red-800 font-bold text-lg my-2">
                      {car.price}tr ₫
                    </p>
                    <div className="flex justify-between text-sm text-gray-700 mt-4">
                      <div>
                        <span className="font-semibold">Năm:</span> {car.year}
                      </div>
                      <div>
                        <span className="font-semibold">Số:</span> {car.gearbox}
                      </div>
                      <div>
                        <span className="font-semibold">Km:</span> {car.kilometers}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">Không có xe nào</p>
            )}
          </div>
        </div>

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
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchDetail;
