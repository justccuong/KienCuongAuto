import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import '@fortawesome/fontawesome-free/css/all.min.css';

const branches = [
  {
    name: "Trụ sở chính Kiên Cường Auto",
    location: "771 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0966812888",
    link: "/branches/tru-so-chinh",
    img: "anh-co-so/truso.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 1",
    location: "646 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0986388922",
    link: "/branches/cs1",
    img: "anh-co-so/cs1.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 2",
    location: "646 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0366691888",
    link: "/branches/cs2",
    img: "anh-co-so/cs2.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 4 - Tuyên Quang",
    location: "Km5, Lưỡng Vượng, TP. Tuyên Quang",
    hotline: "0848724999",
    link: "/branches/cs4",
    img: "anh-co-so/cs4.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 5 - Việt Trì",
    location: "559 Đại lộ Hùng Vương, TP. Việt Trì, Phú Thọ",
    hotline: "0987771022",
    link: "/branches/cs5",
    img: "anh-co-so/cs5.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 6 - Bình Dương",
    location: "278 ĐT 743, Tân Đông Hiệp, TP. Dĩ An, Bình Dương",
    hotline: "0385882418",
    link: "/branches/cs6",
    img: "anh-co-so/cs6.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 7 - Hương Canh",
    location: "Hương Canh, Bình Xuyên, Vĩnh Phúc",
    hotline: "0962969926",
    link: "/branches/cs7",
    img: "anh-co-so/cs7.jpg",
  },
];

const BranchesGrid = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Hệ thống chi nhánh của chúng tôi
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-x-10 gap-y-8 px-4">
        {branches.map((branch, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={index}
              className={`
                ${isFirst ? 'md:col-span-3 md:flex md:justify-center' : ''}
              `}
            >
              <div className="w-full max-w-[350px] bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col items-center text-gray-800 hover:scale-105 transition-transform duration-300 mx-auto">
                <img
                  src={branch.img}
                  alt={branch.name}
                  className="w-full h-64 object-cover rounded-2xl mb-4"
                />
                <h3 className="text-xl font-semibold text-center mb-2">
                  {branch.name}
                </h3>
                <p className="text-center mb-1">
                  <i className="fas fa-map-marker-alt mr-2" />
                  {branch.location}
                </p>
                <p className="text-center font-semibold text-gray-700 mt-1">
                  <i className="fas fa-phone-alt mr-2 text-blue-600" />
                  {branch.hotline}
                </p>
                <a
                  href={branch.link}
                  className="inline-block w-full text-center mt-2 bg-gray-200 text-white py-2 rounded-xl font-medium hover:bg-gray-400 transition"
                >
                  Xem xe tại chi nhánh
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default BranchesGrid;