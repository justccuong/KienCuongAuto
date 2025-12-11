import React, { useState, useEffect } from "react";
import { Link, useLocation, matchPath } from "react-router-dom"; 
import api from "../../utils/axios"; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const location = useLocation();

  const DEFAULT_INFO = {
    hotline: "0562 73 6868",
    facebook: "https://www.facebook.com/kiencuongmedia",
    tiktok: "https://www.tiktok.com/@kiencuongmedia",
    youtube: "https://youtube.com/@kiencuongmedia",
    zalo: "https://zalo.me/0562736868",
    address: "771 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc"
  };

  const [info, setInfo] = useState(DEFAULT_INFO);

  useEffect(() => {
    const updateFooterInfo = async () => {
      const path = location.pathname;

      const carMatch = matchPath("/cars/:id", path);
      if (carMatch) {
        try {
          const carRes = await api.get(`/cars/detail/${carMatch.params.id}`);
          const branchName = carRes.data.car.branch;

          if (branchName) {
            const branchesRes = await api.get("/branches");
            const foundBranch = branchesRes.data.find(b => b.name === branchName);
            
            if (foundBranch) {
              setInfo({
                hotline: foundBranch.hotline || DEFAULT_INFO.hotline,
                facebook: foundBranch.socials?.facebook || DEFAULT_INFO.facebook,
                tiktok: foundBranch.socials?.tiktok || DEFAULT_INFO.tiktok,
                zalo: foundBranch.socials?.zalo || DEFAULT_INFO.zalo,
                address: foundBranch.location || DEFAULT_INFO.address,
                youtube: DEFAULT_INFO.youtube, 
              });
              return;
            }
          }
        } catch (err) {
          console.error("Footer: Lỗi lấy info từ xe", err);
        }
      }

      const branchMatch = matchPath("/branches/:id", path);
      if (branchMatch) {
        try {
          const branchesRes = await api.get("/branches");
          const foundBranch = branchesRes.data.find(b => b.id === branchMatch.params.id || b._id === branchMatch.params.id);

          if (foundBranch) {
            setInfo({
              hotline: foundBranch.hotline || DEFAULT_INFO.hotline,
              facebook: foundBranch.socials?.facebook || DEFAULT_INFO.facebook,
              tiktok: foundBranch.socials?.tiktok || DEFAULT_INFO.tiktok,
              zalo: foundBranch.socials?.zalo || DEFAULT_INFO.zalo,
              address: foundBranch.location || DEFAULT_INFO.address,
              youtube: DEFAULT_INFO.youtube,
            });
            return;
          }
        } catch (err) {
          console.error("Footer: Lỗi lấy info từ chi nhánh", err);
        }
      }

      setInfo(DEFAULT_INFO);
    };

    updateFooterInfo();
  }, [location.pathname]);

  return (
    <div className="bg-gray-100 border-t border-gray-200 mt-auto">
      <footer className="max-w-7xl mx-auto px-4 py-12 text-gray-600">
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center md:text-left">
          
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start">
            <Link to="/home" className="group">
              <img 
                src="/logo_done.png" 
                alt="Kiên Cường Auto" 
                className="w-40 h-auto mb-4 transition-transform transform group-hover:scale-105 duration-300" 
              />
            </Link>
            <p className="text-sm italic mb-4 leading-relaxed max-w-xs mx-auto lg:mx-0">
              <q>
                <span className="font-semibold text-red-600">Uy tín </span> 
                tạo nên thương hiệu - 
                <span className="font-semibold text-red-600"> Chất lượng </span> 
                dẫn lối thành công.
              </q>
            </p>
            <div className="text-xs text-gray-400">© 2025 KienCuongAuto. All rights reserved.</div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-2 border-b-2 border-red-500 w-fit mx-auto lg:mx-0 pb-1">Danh mục</h3>
            <Link to="/home" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">Trang chủ</Link>
            <Link to="/about-kien-cuong" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">Về chúng tôi</Link>
            <Link to="/branches" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">Hệ thống chi nhánh</Link>
            <Link to="/find-car" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block">Tìm mua xe</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-2 border-b-2 border-red-500 w-fit mx-auto lg:mx-0 pb-1">Kết nối</h3>
            
            <a href={info.facebook} target="_blank" rel="noreferrer" className="group flex items-center justify-center lg:justify-start gap-3 hover:text-blue-600 transition-colors text-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                <i className="fab fa-facebook-f"></i>
              </div>
              <span className="font-medium">Facebook</span>
            </a>

            <a href={info.youtube} target="_blank" rel="noreferrer" className="group flex items-center justify-center lg:justify-start gap-3 hover:text-red-600 transition-colors text-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                <i className="fab fa-youtube"></i>
              </div>
              <span className="font-medium">Youtube</span>
            </a>

            <a href={info.tiktok} target="_blank" rel="noreferrer" className="group flex items-center justify-center lg:justify-start gap-3 hover:text-black transition-colors text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                <i className="fab fa-tiktok"></i>
              </div>
              <span className="font-medium">TikTok</span>
            </a>

            <a href={`tel:${info.hotline.replace(/\s/g, '')}`} className="group flex items-center justify-center lg:justify-start gap-3 hover:text-green-600 transition-colors text-sm font-bold">
               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 group-hover:animate-pulse">
                 <i className="fas fa-phone-alt"></i>
               </div>
               <span>{info.hotline}</span>
            </a>
          </div>

          <div className="flex flex-col gap-3 items-center lg:items-start">
             <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-2 border-b-2 border-red-500 w-fit mx-auto lg:mx-0 pb-1">Hỗ trợ</h3>
             
             <div className="text-sm text-gray-500 flex gap-2 items-start justify-center lg:justify-start">
                <i className="fas fa-map-marker-alt text-red-500 mt-1"></i>
                <span className="max-w-[200px] text-left">{info.address}</span>
             </div>

             <a href="mailto:contact@kiencuongauto.vn" className="text-red-600 font-bold text-lg hover:underline decoration-2 underline-offset-4 mt-2">
                KienCuongAuto.vn
             </a>

             <div className="mt-6 pt-6 border-t border-gray-200 w-full text-center lg:text-left">
                <a 
                  href="https://github.com/justccuong" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer select-none group"
                  title="Dev by Cuong"
                >
                  Code with <span className="text-red-400 group-hover:scale-125 transition-transform duration-300">❤️</span> by <span className="font-mono font-bold ml-1">justccuong</span>
                </a>
             </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;