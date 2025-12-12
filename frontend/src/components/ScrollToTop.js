import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Lấy đường dẫn hiện tại (pathname)
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi pathname thay đổi -> Cuộn lên đầu trang (0, 0)
    // "instant" giúp nó nhảy lên ngay lập tức, không bị trượt từ từ gây chóng mặt
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", 
    });
  }, [pathname]);

  return null; // Component này không render ra giao diện gì cả, chỉ chạy logic ngầm
};

export default ScrollToTop;