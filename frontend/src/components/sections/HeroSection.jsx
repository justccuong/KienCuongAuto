import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const banners = [
  "/anh-co-so/truso.jpg",
  "/anh-co-so/cs1.jpg",
  "/anh-co-so/cs2.jpg",
  "/anh-co-so/cs4.jpg",
  "/anh-co-so/cs5.jpg",
  "/anh-co-so/cs6.jpg",
  "/anh-co-so/cs7.jpg",

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
