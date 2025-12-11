import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../input/ScrollToTop"; 

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen relative"> 
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      <ScrollToTop />
    </div>
  );
};

export default Layout;