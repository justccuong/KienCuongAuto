import React from "react";
import Footer from "../../components/layouts/Footer";
import Header from "../../components/layouts/Header";
import ScrollToTop from "../../components/input/ScrollToTop";
import HeroSection from "../../components/sections/HeroSection";
import BranchesSection from "../../components/sections/BranchesSection";


const branchesData = [
  { id: 1, name: "Hanoi Center", district: "Ba Dinh", address: "123 Phan Dinh Phung", phone: "024-1234-5678", img: "/branches/hanoi.jpg" },
  { id: 2, name: "Ho Chi Minh Showroom", district: "District 1", address: "456 Nguyen Hue", phone: "028-8765-4321", img: "/branches/hcm.jpg" },
  { id: 3, name: "Da Nang Hub", district: "Hai Chau", address: "789 Bach Dang", phone: "0236-555-9999", img: "/branches/danang.jpg" },
];

const Home = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">

    <HeroSection />
    <BranchesSection branches={branchesData} />
    
    <ScrollToTop />

  </div>
);

export default Home;
