import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // 👈 1. Thêm Navigation vào đây
import "swiper/css";
import "swiper/css/navigation"; // 👈 2. Import CSS navigation

const banners = [
  "/anh-co-so/truso.jpg",
  "/anh-co-so/cs1.jpg",
  "/anh-co-so/cs2.jpg",
  "/anh-co-so/cs4.jpg",
  "/anh-co-so/cs5.jpg",
  "/anh-co-so/cs7.jpg",
];

const HeroSection = () => (
  <section className="w-full h-[250px] sm:h-[400px] lg:h-180 relative group">
    
    {/* 👇 Style đè để mũi tên màu trắng, nhỏ gọn và chỉ hiện khi hover (tùy chỉnh) */}
    <style>
      {`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          opacity: 0.3; /* Mờ mờ cho đỡ che ảnh */
          transition: all 0.3s ease;
          background-color: rgba(0,0,0,0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        /* Khi di chuột vào slider thì mũi tên đậm lên */
        .group:hover .swiper-button-next, 
        .group:hover .swiper-button-prev {
          opacity: 1;
          background-color: rgba(0,0,0,0.5); /* Nền đen rõ hơn */
        }

        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 18px !important; /* Mũi tên nhỏ lại cho tinh tế */
          font-weight: bold;
        }
      `}
    </style>

    <Swiper
      modules={[Autoplay, Navigation]} // 👈 3. Khai báo module
      navigation={true} // 👈 4. Bật tính năng navigation
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="h-full"
    >
      {banners.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url('${img}')` }}
          >
            {/* Overlay nhẹ để chữ menu bên trên dễ nhìn hơn (nếu có) */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default HeroSection;