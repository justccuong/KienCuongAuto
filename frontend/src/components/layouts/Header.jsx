import React, { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from "react-router-dom";
import CarSearchBar from "../sections/CarSearchBar";
import { useAuth } from "../../context/AuthContext"; // ✅ USE AUTH CONTEXT

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);      
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth(); // ✅ Get user from context
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout(); // ✅ Use context logout
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;

      setIsOpen(false);
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

        <div className="flex-shrink-0 flex items-center gap-3 overflow-hidden">
          <Link to="/home" className="block">
            <img 
              src="/logo_done.png" 
              alt="logo" 
              className="h-8 md:h-10 w-auto max-w-[150px] md:max-w-none object-contain" 
            />
          </Link>
        </div>

        <div className="hidden md:block flex-1 mx-4 max-w-xl">
           <CarSearchBar />
        </div>

        <nav className="hidden md:flex gap-6 items-center flex-shrink-0">
          <Link className="ct-top-menu-item font-bold" to="/home">TRANG CHỦ</Link>
          <Link className="ct-top-menu-item font-bold" to="/about-kien-cuong">VỀ KIÊN CƯỜNG</Link>
          <Link className="ct-top-menu-item font-bold" to="/branches">CHI NHÁNH</Link>
          <Link className="ct-top-menu-item font-bold" to="/find-car">TÌM XE</Link>
          {user?.role === "admin" && (
            <Link className="ct-top-menu-item text-red-600 font-bold hover:text-red-800" to="/admin">
              QUẢN LÝ
            </Link>
          )}
        </nav>

        {/* --- KHU VỰC USER (DESKTOP) --- */}
        <div className="hidden md:flex items-center gap-3 ml-6 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/account" 
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors group"
                title="Xem thông tin tài khoản"
              >
                <i className="fa-regular fa-user text-red-600 text-lg group-hover:scale-110 transition-transform"></i>
                <span className="text-sm font-semibold truncate max-w-[120px] text-gray-700 group-hover:text-red-600">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-500 ml-1 border-l pl-2 border-gray-300"
              >
                Thoát
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

        <div className="flex items-center gap-3 md:hidden flex-shrink-0 ml-auto">
          <button 
            onClick={() => {
              setShowSearch(!showSearch);
              setIsOpen(false); 
            }}
            className={`text-xl p-2 transition-colors ${showSearch ? 'text-red-600' : 'text-gray-600'}`}
          >
             <i className={`fas ${showSearch ? 'fa-times' : 'fa-search'}`}></i>
          </button>
          
          <button
            ref={toggleRef}
            onClick={() => {
              setIsOpen(!isOpen);
              setShowSearch(false);
            }}
            className="text-2xl text-gray-800 focus:outline-none p-1"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white p-4 shadow-inner border-t z-40 md:hidden animate-fade-in-down">
           <CarSearchBar />
        </div>
      )}

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 md:hidden animate-fade-in-down"
        >
          <nav className="flex flex-col p-4 gap-4 text-base font-medium text-gray-700">
            <Link to="/home" className="ct-top-menu-item block w-fit" onClick={() => setIsOpen(false)}>TRANG CHỦ</Link>
            <Link to="/about-kien-cuong" className="ct-top-menu-item block w-fit" onClick={() => setIsOpen(false)}>VỀ KIÊN CƯỜNG</Link>
            <Link to="/branches" className="ct-top-menu-item block w-fit" onClick={() => setIsOpen(false)}>HỆ THỐNG CHI NHÁNH</Link>
            <Link to="/find-car" className="ct-top-menu-item block w-fit" onClick={() => setIsOpen(false)}>TÌM MUA XE</Link>
            
            {user?.role === "admin" && (
              <Link to="/admin" className="ct-top-menu-item block w-fit text-red-600 font-bold" onClick={() => setIsOpen(false)}>QUẢN LÝ XE</Link>
            )}

            <div className="pt-2 border-t mt-2">
              {user ? (
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  
                  <Link 
                    to="/account" 
                    className="flex items-center gap-2 flex-1"
                    onClick={() => setIsOpen(false)} 
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                       <i className="fa-regular fa-user"></i>
                    </div>
                    <span className="font-bold text-gray-800">{user.name}</span>
                  </Link>

                  <button onClick={handleLogout} className="text-sm text-red-500 font-semibold px-2 py-1 border border-red-200 rounded hover:bg-red-50">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/signup" className="text-center py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={() => setIsOpen(false)}>
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