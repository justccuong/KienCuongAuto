import React from "react";


const COLOR_MAP = {

  "Màu Trắng": "#FFFFFF",
  "Màu Đen": "#000000",
  "Màu Xám (Grey)": "#4B5563",
  "Màu Bạc (Silver)": "linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)",
  "Màu Đỏ": "#DC2626",
  "Màu Đỏ Đô": "#991B1B", 
  "Màu Cam": "#EA580C",
  "Màu Vàng": "#FACC15",
  "Màu Vàng Cát": "#D4A017", 
  "Màu Vàng Đồng": "#B45309",
  "Màu Champagne": "#FDE68A", 
  "Màu Be (Beige)": "#F5F5DC",
  "Màu Xanh (Blue)": "#2563EB",
  "Màu Xanh Đen (Cavansite)": "#172554", 
  "Màu Xanh Lá": "#16A34A",
  "Màu Xanh Ngọc": "#0D9488",
  "Màu Xanh Rêu": "#3F6212",
  "Màu Nâu (Cafe)": "#451a03",
  "Màu Nâu Đất": "#78350F",
  "Màu Tím": "#7C3AED",
  "Màu Hồng": "#DB2777",
  "Màu Titan": "linear-gradient(135deg, #374151 0%, #111827 100%)",
};

const ColorSelect = ({ label, name, value, options, onChange }) => {
  
  const handleSelect = (selectedVal) => {
    const fakeEvent = {
      target: { name, value: selectedVal }
    };
    onChange(fakeEvent);
  };

  const getBackgroundStyle = (colorName) => {
    let bg = COLOR_MAP[colorName];
    if (!bg) {
        const lower = colorName.toLowerCase();
        if (lower.includes('trắng')) bg = '#FFFFFF';
        else if (lower.includes('đen')) bg = '#000000';
        else if (lower.includes('đỏ')) bg = '#DC2626';
        else if (lower.includes('xanh')) bg = '#2563EB';
        else bg = '#E5E7EB'; 
    }
    return bg;
  };

  return (
    <div className="block text-gray-700 group">
      <span className="font-semibold text-sm mb-2.5 block group-hover:text-red-600 transition-colors">
        {label}
      </span>
      
      <div className="flex flex-wrap gap-2.5"> 
        {options.map((opt) => {
          const bgStyle = getBackgroundStyle(opt);
          const isSelected = value === opt;
          const isLightColor = opt.includes("Trắng") || opt.includes("Be") || opt.includes("Bạc") || opt.includes("Champagne");

          return (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`
                group/tooltip relative cursor-pointer w-9 h-9 rounded-full shadow-sm transition-all duration-200
                flex items-center justify-center
                ${isSelected 
                  ? "ring-2 ring-offset-2 ring-red-500 scale-110 z-10" 
                  : "hover:scale-105 hover:shadow-md ring-1 ring-gray-200 hover:z-10"
                }
              `}
              style={{ background: bgStyle }}
            >
              {isSelected && (
                <i className={`fas fa-check text-xs ${isLightColor ? 'text-gray-800' : 'text-white'}`}></i>
              )}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                              bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded 
                              opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200
                              whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {opt}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 text-xs font-medium text-gray-500 h-4 flex items-center gap-1">
        {value ? (
          <>
            Đang chọn: 
            <span className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {value}
            </span>
          </>
        ) : (
          <span className="italic">Chưa chọn màu</span>
        )}
      </div>
    </div>
  );
};

export default ColorSelect;