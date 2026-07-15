import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation"; 

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
    <Swiper
      modules={[Autoplay, Navigation]} 
      navigation={true} 
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="h-full hero-swiper"
    >
      {banners.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="w-full h-full relative">
            <img 
              src={img} 
              alt={`Showroom Kiên Cường Auto ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/10"></div>
            {idx === 0 && (
              <div className="absolute inset-0 flex items-end justify-start p-6 sm:p-10 lg:p-16 z-10">
                <div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                    Kiên Cường Auto
                  </h1>
                  <p className="text-sm sm:text-lg text-white/90 mt-2 drop-shadow-md max-w-lg">
                    Uy tín tạo nên thương hiệu — Chất lượng dẫn lối thành công
                  </p>
                </div>
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default HeroSection;