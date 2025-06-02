import React, { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Bắt sự kiện click outside để tự đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      // nếu click vào icon toggle thì bỏ qua
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      // nếu click ngoài menu thì đóng
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative bg-white text-gray-900 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-10 h-14 md:h-16">
        {/* Logo */}
        <a href="/home">
          <img src="/logo_done.png" alt="logo" className="h-8 md:h-10" />
        </a>

        {/* Hamburger (mobile only) */}
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(o => !o)}
          className="md:hidden text-xl"
          aria-label="Toggle menu"
          title="Toggle menu"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 items-center">
          <a className="ct-top-menu-item" href="/home">TRANG CHỦ</a>
          <a className="ct-top-menu-item" href="/about-kien-cuong">VỀ KIÊN CƯỜNG</a>
          <a className="ct-top-menu-item" href="/contact">LIÊN HỆ</a>
        </nav>

        {/* Account desktop */}
        <div className="hidden md:flex items-center gap-3">
          <i className="fa-regular fa-user text-red-600 hover:text-red-800"></i>
          <a className="ct-top-menu-item" href="/login">Đăng nhập</a>
          <span>|</span>
          <a className="ct-top-menu-item" href="/register">Đăng ký</a>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white shadow-md z-50 md:hidden px-4 py-3"
        >
          <nav className="flex flex-col gap-3">
            <a href="/home" className="block py-1">TRANG CHỦ</a>
            <a href="/about-kien-cuong" className="block py-1">VỀ KIÊN CƯỜNG</a>
            <a href="/contact" className="block py-1">LIÊN HỆ</a>
            <div className="border-t pt-3 mt-2">
              <a href="/login" className="inline-block py-1">Đăng nhập</a>
              <span className="px-2">|</span>
              <a href="/register" className="inline-block py-1">Đăng ký</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
