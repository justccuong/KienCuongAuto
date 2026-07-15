import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../input/ScrollToTop"; 

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen relative"> 
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-red-600 focus:font-bold">
        Bỏ qua đến nội dung chính
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      <ScrollToTop />
    </div>
  );
};

export default Layout;