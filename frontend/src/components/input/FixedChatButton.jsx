import React, { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import api from "../../utils/axios";

const FixedChatButtons = () => {
  const location = useLocation();

  // 1. Cấu hình mặc định (Trụ sở chính/Tổng đài)
  const DEFAULT_CONTACT = {
    zalo: "0562736868",
    facebook: "https://www.facebook.com/kiencuongmedia",
  };

  const [contact, setContact] = useState(DEFAULT_CONTACT);

  // 2. Logic "Thông minh": Tự đổi số theo trang đang đứng
  useEffect(() => {
    const updateContactInfo = async () => {
      const path = location.pathname;

      // CASE A: Đang ở trang Chi tiết xe (/cars/:id)
      const carMatch = matchPath("/cars/:id", path);
      if (carMatch) {
        try {
          // Lấy thông tin xe -> Lấy tên chi nhánh -> Lấy thông tin chi nhánh
          const carRes = await api.get(`/cars/detail/${carMatch.params.id}`);
          const branchName = carRes.data.car.branch;

          if (branchName) {
            const branchesRes = await api.get("/branches");
            const foundBranch = branchesRes.data.find(b => b.name === branchName);
            
            if (foundBranch) {
              setContact({
                zalo: foundBranch.hotline || DEFAULT_CONTACT.zalo,
                facebook: foundBranch.socials?.facebook || DEFAULT_CONTACT.facebook,
              });
              return; // Xong việc, thoát luôn
            }
          }
        } catch (err) {
          console.error("Lỗi lấy contact từ xe:", err);
        }
      }

      // CASE B: Đang ở trang Chi tiết Chi nhánh (/branches/:id)
      const branchMatch = matchPath("/branches/:id", path);
      if (branchMatch) {
        try {
          const branchesRes = await api.get("/branches");
          // Tìm chi nhánh theo ID trên URL
          const foundBranch = branchesRes.data.find(b => b.id === branchMatch.params.id || b._id === branchMatch.params.id);

          if (foundBranch) {
            setContact({
              zalo: foundBranch.hotline || DEFAULT_CONTACT.zalo,
              facebook: foundBranch.socials?.facebook || DEFAULT_CONTACT.facebook,
            });
            return;
          }
        } catch (err) {
          console.error("Lỗi lấy contact từ chi nhánh:", err);
        }
      }

      // CASE C: Các trang còn lại -> Về mặc định
      setContact(DEFAULT_CONTACT);
    };

    updateContactInfo();
  }, [location.pathname]); // Chạy lại mỗi khi đổi trang

  // 3. CSS Animation lắc lư (Wiggle)
  const shakeStyle = `
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .animate-wiggle {
      animation: wiggle 1s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{shakeStyle}</style>
      
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4 group">
        
        {/* Nút Zalo */}
        <a
          href={`https://zalo.me/${contact.zalo.replace(/\s/g, "")}`} // Xóa khoảng trắng trong sđt nếu có
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white shadow-xl rounded-full pl-2 pr-4 py-2 hover:scale-110 transition-all duration-300 border border-blue-100 animate-wiggle"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
             <img src="/chat_logo/zalo.jpg" alt="Zalo" className="w-full h-full object-cover" />
             {/* Chấm xanh online */}
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Tư vấn ngay</span>
            <span className="text-sm font-bold text-blue-600">Chat Zalo</span>
          </div>
        </a>

        {/* Nút Messenger */}
        <a
          href={contact.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white shadow-xl rounded-full pl-2 pr-4 py-2 hover:scale-110 transition-all duration-300 border border-blue-100"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img src="/chat_logo/face.webp" alt="Facebook" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
             <span className="text-xs text-gray-500 font-medium">Nhắn tin</span>
             <span className="text-sm font-bold text-blue-700">Messenger</span>
          </div>
        </a>

      </div>
    </>
  );
};

export default FixedChatButtons;