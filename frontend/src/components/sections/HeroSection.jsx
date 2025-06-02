import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const banners = [
  "/banner/1.jpg",
  "/banner/2.jpg",
  "/banner/3.jpg",
  "/banner/4.jpg",
  "/banner/5.jpg",
];

const HeroSection = () => (
  <section className="w-full h-180 relative">
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="h-full"
    >
      {banners.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div
            className="w-full h-180 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${img}')` }}
          >
            
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default HeroSection;
