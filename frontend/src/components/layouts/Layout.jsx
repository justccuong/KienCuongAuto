import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
// 👇 1. Import cái nút thần thánh vào đây (nhớ chỉnh đường dẫn cho đúng folder nhé)
import ScrollToTop from "../input/ScrollToTop"; 

const Layout = () => {
  return (
    // Thêm relative để chắc chắn context, nhưng fixed thì nó cân tất
    <div className="flex flex-col min-h-screen relative"> 
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      {/* 👇 2. Thả nó vào đây, nằm ngoài cùng để nó nổi lên trên tất cả */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;