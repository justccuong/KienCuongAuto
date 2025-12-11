import React from "react";
import ScrollToTop from "../../components/input/ScrollToTop";
import HeroSection from "../../components/sections/HeroSection";
import BranchesSection from "../../components/sections/BranchesSection"; 
import ServicesSection from "../../components/sections/ServicesSection";
import NewArrivalsSection from "../../components/sections/NewArrivalsSection"; 

const Home = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <HeroSection />
    <BranchesSection /> 
    <NewArrivalsSection />
    <ServicesSection />
  </div>
);

export default Home;