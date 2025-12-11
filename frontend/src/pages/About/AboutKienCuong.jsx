import React from "react";
import { FaHandshake, FaEye, FaGem, FaBalanceScale, FaUsers, FaCar, FaBuilding, FaAward } from "react-icons/fa";

export default function About() {
  return (
    <div className="w-full bg-gray-50 text-gray-800 font-sans">
      
      {/* --- HERO BANNER --- */}
      <div className="relative bg-gradient-to-r from-red-900 to-red-600 py-20 px-6 text-center text-white overflow-hidden">
        {/* Họa tiết nền mờ (Optional) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <img 
            src="/logo.png" 
            alt="Logo Kiên Cường" 
            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 object-contain bg-white rounded-full p-2 shadow-2xl"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            VỀ KIÊN CƯỜNG AUTO
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
            Uy tín tạo nên thương hiệu - Chất lượng dẫn lối thành công
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        
        {/* --- GIỚI THIỆU CHUNG (Card lớn) --- */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-t-8 border-red-600">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaBuilding className="text-red-600" /> Giới thiệu công ty
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                <strong>Kiên Cường Auto</strong> là đơn vị tiên phong trong lĩnh vực kinh doanh xe ô tô đã qua sử dụng tại Việt Nam. 
                Với hơn 15 năm hình thành và phát triển, chúng tôi tự hào sở hữu hệ thống showroom quy mô lớn, đội ngũ nhân sự chuyên nghiệp 
                và quy trình kiểm định xe nghiêm ngặt. Cam kết mang đến cho khách hàng những chiếc xe 
                <span className="text-red-600 font-bold"> "Chuẩn chất lượng - Rõ pháp lý - Minh bạch giá"</span>.
              </p>
            </div>
            {/* Ảnh minh họa hoặc Logo phụ */}
            <div className="w-full md:w-1/3">
               <img 
                 src="/anh-co-so/truso.jpg" 
                 alt="Showroom Kiên Cường" 
                 className="rounded-2xl shadow-lg w-full h-auto object-cover transform hover:scale-105 transition duration-500"
                 onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Kien+Cuong+Showroom"}
               />
            </div>
          </div>
        </div>

        {/* --- 4 GIÁ TRỊ CỐT LÕI (Grid 2x2) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Sứ mệnh */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-blue-500 group">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <FaHandshake />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Sứ mệnh</h3>
            <p className="text-gray-600">
              Giúp khách hàng lựa chọn xe đã qua sử dụng một cách <strong className="text-blue-600">AN TÂM</strong> và dễ dàng nhất. Mang lại giá trị thực cho người dùng Việt.
            </p>
          </div>

          {/* Tầm nhìn */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-green-500 group">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-4 group-hover:bg-green-600 group-hover:text-white transition">
              <FaEye />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Tầm nhìn</h3>
            <p className="text-gray-600">
              Trở thành thương hiệu được yêu thích và tin cậy <strong className="text-green-600">SỐ 1</strong> trong lĩnh vực xe ô tô đã qua sử dụng tại Việt Nam.
            </p>
          </div>

          {/* Giá trị cốt lõi */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-yellow-500 group">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-2xl mb-4 group-hover:bg-yellow-500 group-hover:text-white transition">
              <FaGem />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Giá trị cốt lõi</h3>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li className="flex items-center gap-2"><i className="fas fa-check text-yellow-500"></i> Trung Thực trong từng lời nói.</li>
              <li className="flex items-center gap-2"><i className="fas fa-check text-yellow-500"></i> Tận Tâm trong từng hành động.</li>
              <li className="flex items-center gap-2"><i className="fas fa-check text-yellow-500"></i> Tử Tế trong mọi giao dịch.</li>
            </ul>
          </div>

          {/* Triết lý vận hành */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-purple-500 group">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <FaBalanceScale />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Triết lý vận hành</h3>
            <p className="text-gray-600 italic">
              <q>Không phân biệt</q> - Chúng tôi phục vụ mọi khách hàng với sự trân trọng như nhau, không phân biệt giá trị xe, tài chính hay mục đích sử dụng.
            </p>
          </div>
        </div>

        {/* --- THỐNG KÊ (Counter) --- */}
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <div className="text-5xl font-extrabold text-red-500 mb-2">15+</div>
              <div className="text-gray-300 text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                <FaAward /> Năm kinh nghiệm
              </div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-blue-500 mb-2">80+</div>
              <div className="text-gray-300 text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                <FaUsers /> Nhân sự
              </div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-500 mb-2">5k+</div>
              <div className="text-gray-300 text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                <FaCar /> Xe đã bán
              </div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-yellow-500 mb-2">7</div>
              <div className="text-gray-300 text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                <FaBuilding /> Showroom
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}