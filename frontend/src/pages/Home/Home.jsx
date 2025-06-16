import React from "react";
import ScrollToTop from "../../components/input/ScrollToTop";
import HeroSection from "../../components/sections/HeroSection";
import BranchesSection from "../../components/sections/BranchesSection";
import ServicesSection from "../../components/sections/ServicesSection";

const Home = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">

    <HeroSection />
    <BranchesSection />
    
    <ScrollToTop />
    <ServicesSection />
  </div>
);

export default Home;
