import React, { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import CarSearchBar from "../sections/CarSearchBar";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // 👀 Fetch user info nếu đã đăng nhập
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // 👋 Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✋ Click ngoài thì đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative bg-white text-gray-900 top-0 left-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-10 h-14 md:h-16">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href="/home">
            <img src="/logo_done.png" alt="logo" className="h-8 md:h-10" />
          </a>
        </div>

        <CarSearchBar />

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <a className="ct-top-menu-item" href="/home">TRANG CHỦ</a>
          <a className="ct-top-menu-item" href="/about-kien-cuong">VỀ KIÊN CƯỜNG</a>
          <a className="ct-top-menu-item" href="/branches">CÁC CHI NHÁNH</a>
          <a className="ct-top-menu-item" href="/find-car">TÌM MUA XE</a>
          {user?.role === "admin" && (
            <a className="ct-top-menu-item text-red-600 font-semibold" href="/admin">
              QUẢN LÝ XE
            </a>
          )}
        </nav>

        {/* Desktop Account */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          {user ? (
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-user text-red-600 text-lg"></i>
              <a href="/account" className="text-sm font-medium hover:underline">{user.name}</a>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline ml-2"
                style={{ outline: "none", boxShadow: "none", border: "none" }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <i className="fa-regular fa-user text-red-600 hover:text-red-800"></i>
              <a className="ct-top-menu-item" href="/login">Đăng nhập</a>
              <span>|</span>
              <a className="ct-top-menu-item" href="/signup">Đăng ký</a>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(o => !o)}
          className="md:hidden text-xl ml-3"
          aria-label="Toggle menu"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white shadow-md z-50 md:hidden px-4 py-3"
        >
          <nav className="flex flex-col gap-3 text-sm">
            <a href="/home" className="ct-top-menu-item block py-1">TRANG CHỦ</a>
            <a href="/about-kien-cuong" className="ct-top-menu-item block py-1">VỀ KIÊN CƯỜNG</a>
            <a href="/branches" className="ct-top-menu-item block py-1">CÁC CHI NHÁNH</a>
            <a href="/find-car" className="ct-top-menu-item block py-1">TÌM MUA XE</a>
            {user?.role === "admin" && (
              <a href="/admin" className="ct-top-menu-item block py-1 text-red-600 font-semibold">
                QUẢN LÝ XE
              </a>
            )}
            <div className="border-t pt-3 mt-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <i className="fa-regular fa-user text-red-600 text-lg"></i>
                    <a href="/account" className="inline-block font-semibold">{user.name}</a>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:underline mt-1">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="inline-block py-1">Đăng nhập</a>
                  <span className="px-2">|</span>
                  <a href="/register" className="inline-block py-1">Đăng ký</a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
