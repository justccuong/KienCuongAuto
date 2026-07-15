import React from "react";
import useBranchContact from "../../hooks/useBranchContact";

const FixedChatButtons = () => {
  const branchInfo = useBranchContact();

  const DEFAULT_CONTACT = {
    zalo: "0562736868",
    facebook: "https://www.facebook.com/kiencuongmedia",
  };

  const zalo = branchInfo?.hotline || DEFAULT_CONTACT.zalo;
  const facebook = branchInfo?.socials?.facebook || DEFAULT_CONTACT.facebook;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4 group">
      
      <a
        href={`https://zalo.me/${zalo.replace(/\s/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo với Kiên Cường Auto"
        className="flex items-center gap-3 bg-white shadow-xl rounded-full pl-2 pr-4 py-2 hover:scale-110 transition-all duration-300 border border-blue-100"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
           <img src="/chat_logo/zalo.jpg" alt="Zalo" className="w-full h-full object-cover" />
         
           <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium">Tư vấn ngay</span>
          <span className="text-sm font-bold text-blue-600">Chat Zalo</span>
        </div>
      </a>

      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Messenger với Kiên Cường Auto"
        className="flex items-center gap-3 bg-white shadow-xl rounded-full pl-2 pr-4 py-2 hover:scale-110 transition-all duration-300 border border-blue-100"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img src="/chat_logo/face.webp" alt="Facebook Messenger" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
           <span className="text-xs text-gray-500 font-medium">Nhắn tin</span>
           <span className="text-sm font-bold text-blue-700">Messenger</span>
        </div>
      </a>

    </div>
  );
};

export default FixedChatButtons;