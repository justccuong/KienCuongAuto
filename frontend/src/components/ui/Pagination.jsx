import React, { useState } from "react";
import { 
  FaChevronLeft, FaChevronRight, 
  FaAngleDoubleLeft, FaAngleDoubleRight, 
  FaArrowRight 
} from "react-icons/fa";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [inputPage, setInputPage] = useState("");

  // Nếu ít hơn hoặc bằng 1 trang thì ẩn luôn
  if (totalPages <= 1) return null;

  // Logic tạo danh sách trang (Hiển thị rút gọn 1,2,3 ... 10)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 5; // Số nút tối đa hiển thị

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, maxVisibleButtons);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Xử lý khi nhập số trang
  const handleInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage);
    
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage(""); // Reset ô nhập
    } else {
      alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 text-gray-600">
      
      {/* 1. DÃY NÚT BẤM */}
      <div className="flex items-center gap-2">
        {/* Nút về Đầu (<<) */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
            currentPage === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          }`}
          title="Trang đầu"
        >
          <FaAngleDoubleLeft />
        </button>

        {/* Nút Lùi (<) */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
            currentPage === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          }`}
        >
          <FaChevronLeft />
        </button>

        {/* Các số trang (1 2 3...) */}
        {renderPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-sm transition-all shadow-sm ${
              currentPage === number
                ? "bg-red-600 text-white border-red-600 scale-110"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}

        {/* Nút Tiến (>) */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
            currentPage === totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          }`}
        >
          <FaChevronRight />
        </button>

        {/* Nút về Cuối (>>) */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
            currentPage === totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          }`}
          title="Trang cuối"
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      {/* 2. Ô NHẬP TRANG (GO TO) */}
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2 pl-4 border-l border-gray-300">
        <span className="text-sm">Đến trang:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-center text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          placeholder="..."
        />
        <button 
          type="submit"
          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-red-600 hover:text-white rounded-md transition-colors"
        >
          <FaArrowRight className="text-xs" />
        </button>
      </form>

    </div>
  );
};

export default Pagination;