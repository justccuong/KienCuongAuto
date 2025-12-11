import React from "react";
import ScrollToTop from "../../components/input/ScrollToTop";
import HeroSection from "../../components/sections/HeroSection";
import BranchesSection from "../../components/sections/BranchesSection"; // Hoặc BranchesGrid
import ServicesSection from "../../components/sections/ServicesSection";
import NewArrivalsSection from "../../components/sections/NewArrivalsSection"; // 👇 Import món mới

const Home = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <HeroSection />
    
    {/* Phần chi nhánh nên để đây hoặc sau xe cũng được */}
    <BranchesSection /> 

    {/* 👇 Xe mới về: Đặt ở đây để khách vào là thấy hàng ngay */}
    <NewArrivalsSection />

    {/* Các cam kết dịch vụ */}
    <ServicesSection />
  </div>
);

export default Home;