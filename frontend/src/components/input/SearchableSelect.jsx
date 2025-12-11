import React, { useState, useEffect, useRef } from "react";

const SearchableSelect = ({ label, name, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef(null);

  // 1. Logic lọc danh sách khi gõ
  useEffect(() => {
    if (query === "" && !isOpen) {
      // Nếu đóng menu thì reset list về full
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((opt) =>
          opt.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, options, isOpen]);

  // 2. Đồng bộ giá trị từ Parent vào ô Input (khi mới load hoặc khi chọn xong)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // 3. Xử lý click ra ngoài để đóng menu (Click Outside)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Nếu gõ linh tinh mà không chọn -> Reset về giá trị cũ
        if (!options.includes(query)) {
           setQuery(value || "");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, options, query, value]);

  // 4. Khi chọn 1 item
  const handleSelect = (optionValue) => {
    // Giả lập event để gửi về hàm handleChange của Parent
    const fakeEvent = {
      target: {
        name: name,
        value: optionValue,
      },
    };
    onChange(fakeEvent);
    setQuery(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative block text-gray-700 group">
      <span className="font-semibold text-sm mb-1.5 block group-hover:text-red-600 transition-colors">
        {label}
      </span>
      
      {/* Ô Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true); // Gõ là mở
          }}
          onClick={() => setIsOpen(true)} // Click vào là mở
          placeholder={`-- Nhập để tìm ${label.toLowerCase()} --`}
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all placeholder-gray-400"
        />
        
        {/* Mũi tên chỉ xuống */}
        <div 
          className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-400 hover:text-red-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`}></i>
        </div>
      </div>

      {/* Danh sách sổ xuống */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl animate-fade-in-down scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-2.5 cursor-pointer transition-colors text-sm border-b border-gray-50 last:border-0 ${
                  opt === value 
                    ? "bg-red-50 text-red-700 font-bold" 
                    : "hover:bg-red-50 text-gray-700 hover:text-red-600"
                }`}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-400 italic text-sm text-center">
              Không tìm thấy kết quả...
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;