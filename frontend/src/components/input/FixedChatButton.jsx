// components/FixedChatButtons.jsx
import React from "react";

const FixedChatButtons = () => {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
      <a
        href="https://zalo.me/0562736868"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2 hover:scale-105 transition"
      >
        <img src="/chat_logo/zalo.jpg" alt="Zalo" className="w-8 h-8" />
        <span className="text-sm font-semibold text-orange-700">Chat Zalo</span>
      </a>

      <a
        href="https://www.facebook.com/kiencuongmedia/#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white shadow-lg rounded-full px-3 py-2 hover:scale-105 transition"
      >
        <img src="/chat_logo/face.webp" alt="Facebook" className="w-8 h-8" />
        <span className="text-sm font-semibold text-orange-700">Messenger</span>
      </a>
    </div>
  );  
};

export default FixedChatButtons;
