import React from "react";
import { Link } from "react-router-dom";
import useBranchContact from "../../hooks/useBranchContact";
import { Facebook, Youtube, Phone, MapPin } from "lucide-react";

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
);

const Footer = () => {
  const branchInfo = useBranchContact();

  const DEFAULT_INFO = {
    hotline: "0562 73 6868",
    facebook: "https://www.facebook.com/kiencuongmedia",
    tiktok: "https://www.tiktok.com/@kiencuongmedia",
    youtube: "https://youtube.com/@kiencuongmedia",
    zalo: "https://zalo.me/0562736868",
    address: "771 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc"
  };

  const hotline = branchInfo?.hotline || DEFAULT_INFO.hotline;
  const facebook = branchInfo?.socials?.facebook || DEFAULT_INFO.facebook;
  const tiktok = branchInfo?.socials?.tiktok || DEFAULT_INFO.tiktok;
  const address = branchInfo?.location || DEFAULT_INFO.address;
  const youtube = DEFAULT_INFO.youtube;

  return (
    <div className="bg-gray-50 border-t border-gray-200 mt-auto">
      <footer className="max-w-7xl mx-auto px-6 py-12 text-gray-600">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 text-center sm:text-left">
          
          {/* CỘT 1: LOGO */}
          <div className="flex flex-col items-center sm:items-start">
            <Link to="/home" className="group block mb-4">
              <img 
                src="/logo_done.png" 
                alt="Kiên Cường Auto" 
                className="w-48 h-auto transition-transform transform group-hover:scale-105 duration-300" 
              />
            </Link>
            <p className="text-sm italic mb-4 leading-relaxed max-w-xs">
              <q>
                <span className="font-semibold text-red-600">Uy tín </span> 
                tạo nên thương hiệu - 
                <span className="font-semibold text-red-600"> Chất lượng </span> 
                dẫn lối thành công.
              </q>
            </p>
            <div className="text-xs text-gray-400">© {new Date().getFullYear()} KienCuongAuto.</div>
          </div>

          {/* CỘT 2: DANH MỤC */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4 border-b-2 border-red-500 pb-1 w-fit">
              Danh mục
            </h3>
            <div className="flex flex-col gap-2">
                <Link to="/home" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 duration-200">Trang chủ</Link>
                <Link to="/about-kien-cuong" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 duration-200">Về chúng tôi</Link>
                <Link to="/branches" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 duration-200">Hệ thống chi nhánh</Link>
                <Link to="/find-car" className="hover:text-red-600 transition-colors text-sm hover:translate-x-1 duration-200">Tìm mua xe</Link>
            </div>
          </div>

          {/* CỘT 3: KẾT NỐI */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4 border-b-2 border-red-500 pb-1 w-fit">
              Kết nối
            </h3>
            
            <div className="flex flex-col gap-3 w-fit text-left">
                <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook Kiên Cường Auto" className="flex items-center gap-3 hover:text-blue-600 transition-colors text-sm group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Facebook size={16} />
                  </div>
                  <span className="font-medium">Facebook</span>
                </a>

                <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube Kiên Cường Auto" className="flex items-center gap-3 hover:text-red-600 transition-colors text-sm group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Youtube size={16} />
                  </div>
                  <span className="font-medium">Youtube</span>
                </a>

                <a href={tiktok} target="_blank" rel="noreferrer" aria-label="TikTok Kiên Cường Auto" className="flex items-center gap-3 hover:text-black transition-colors text-sm group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                    <TikTokIcon />
                  </div>
                  <span className="font-medium">TikTok</span>
                </a>

                <a href={`tel:${hotline.replace(/\s/g, '')}`} aria-label="Gọi hotline" className="flex items-center gap-3 hover:text-green-600 transition-colors text-sm font-bold group">
                   <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                     <Phone size={16} />
                   </div>
                   <span className="text-base">{hotline}</span>
                </a>
            </div>
          </div>

          {/* CỘT 4: LIÊN HỆ */}
          <div className="flex flex-col items-center sm:items-start">
             <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4 border-b-2 border-red-500 pb-1 w-fit">
               Liên hệ
             </h3>
             
             <div className="text-sm text-gray-500 flex gap-2 items-start justify-center sm:justify-start text-left max-w-xs sm:max-w-none">
                <MapPin className="text-red-500 mt-1 flex-shrink-0" size={16} />
                <span className="leading-snug">{address}</span>
             </div>

             <a href="mailto:contact@kiencuongauto.vn" className="text-gray-800 font-bold hover:text-red-600 transition-colors mt-3 block">
                contact@kiencuongauto.vn
             </a>

             <div className="mt-6 pt-6 border-t border-gray-200 w-full text-center sm:text-left">
                <a 
                  href="https://github.com/justccuong" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Code with <span className="text-red-500">❤️</span> by <span className="font-mono font-bold">justccuong</span>
                </a>
             </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;