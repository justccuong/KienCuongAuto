import React, { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import CarSearchBar from "../sections/CarSearchBar";
import api from "../../utils/axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);       // State cho Menu 3 gạch
  const [showSearch, setShowSearch] = useState(false); // State cho Thanh tìm kiếm Mobile
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Click ra ngoài thì đóng cả Menu lẫn Search
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Nếu click vào nút toggle menu hoặc nội dung menu thì ko làm gì
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;

      // Logic đóng
      setIsOpen(false);
      // Riêng search bar nếu click vào input thì ko đóng, logic này CarSearchBar tự lo hoặc click ra ngoài hẳn header mới đóng
      // Nhưng để đơn giản, click ra ngoài header sẽ đóng tất
      if (!e.target.closest('header')) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative bg-white text-gray-900 top-0 left-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-10 h-14 md:h-16 w-full max-w-full">

        {/* --- LOGO --- */}
        <div className="flex-shrink-0 flex items-center gap-3 overflow-hidden">
          <Link to="/home" className="block">
            <img 
              src="/logo_done.png" 
              alt="logo" 
              className="h-8 md:h-10 w-auto max-w-[150px] md:max-w-none object-contain" 
            />
          </Link>
        </div>

        {/* --- SEARCH BAR (Desktop Only) --- */}
        <div className="hidden md:block flex-1 mx-4 max-w-xl">
           <CarSearchBar />
        </div>

        {/* --- DESKTOP MENU --- */}
        <nav className="hidden md:flex gap-6 items-center flex-shrink-0">
          <Link className="ct-top-menu-item" to="/home">TRANG CHỦ</Link>
          <Link className="ct-top-menu-item" to="/about-kien-cuong">VỀ KIÊN CƯỜNG</Link>
          <Link className="ct-top-menu-item" to="/branches">CHI NHÁNH</Link>
          <Link className="ct-top-menu-item" to="/find-car">TÌM XE</Link>
          {user?.role === "admin" && (
            <Link className="ct-top-menu-item text-red-600 font-bold hover:text-red-800" to="/admin">
              QUẢN LÝ
            </Link>
          )}
        </nav>

        {/* --- DESKTOP ACCOUNT --- */}
        <div className="hidden md:flex items-center gap-3 ml-6 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-user text-red-600 text-lg"></i>
              <span className="text-sm font-semibold truncate max-w-[100px]">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 ml-1"
              >
                (Thoát)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link to="/login" className="ct-link">Đăng nhập</Link>
              <span className="text-gray-300">|</span>
              <Link to="/signup" className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition">Đăng ký</Link>
            </div>
          )}
        </div>

        {/* --- MOBILE BUTTONS GROUP --- */}
        <div className="flex items-center gap-3 md:hidden flex-shrink-0 ml-auto">
          {/* Nút Kính lúp Mobile */}
          <button 
            onClick={() => {
              setShowSearch(!showSearch);
              setIsOpen(false); // Đóng menu nếu đang mở cho đỡ rối
            }}
            className={`text-xl p-2 transition-colors ${showSearch ? 'text-red-600' : 'text-gray-600'}`}
          >
             <i className={`fas ${showSearch ? 'fa-times' : 'fa-search'}`}></i>
          </button>
          
          {/* Nút 3 gạch Menu */}
          <button
            ref={toggleRef}
            onClick={() => {
              setIsOpen(!isOpen);
              setShowSearch(false); // Đóng search nếu đang mở
            }}
            className="text-2xl text-gray-800 focus:outline-none p-1"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* --- MOBILE SEARCH BAR AREA (Hiện ra khi bấm kính lúp) --- */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white p-4 shadow-inner border-t z-40 md:hidden animate-fade-in-down">
           <CarSearchBar />
        </div>
      )}

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 md:hidden animate-fade-in-down"
        >
          <nav className="flex flex-col p-4 gap-4 text-base font-medium text-gray-700">
            <Link to="/home" className="ct-top-menu-item block w-fit">TRANG CHỦ</Link>
            <Link to="/about-kien-cuong" className="ct-top-menu-item block w-fit">VỀ KIÊN CƯỜNG</Link>
            <Link to="/branches" className="ct-top-menu-item block w-fit">HỆ THỐNG CHI NHÁNH</Link>
            <Link to="/find-car" className="ct-top-menu-item block w-fit">TÌM MUA XE</Link>
            
            {user?.role === "admin" && (
              <Link to="/admin" className="ct-top-menu-item block w-fit text-red-600 font-bold">QUẢN LÝ XE</Link>
            )}

            <div className="pt-2 border-t mt-2">
              {user ? (
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                       <i className="fa-regular fa-user"></i>
                    </div>
                    <span className="font-bold text-gray-800">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-red-500 font-semibold">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="text-center py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;