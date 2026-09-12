import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import useAuth để biết ai đang dùng

const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuth(); // Lấy thông tin user

  useEffect(() => {
    const pathname = location.pathname;

    // 1. CHẶN ADMIN: Nếu user có role là 'admin' HOẶC 'ADMIN', KHÔNG TRACK.
    if (user && (user.role === 'admin' || user.role === 'ADMIN')) {
        console.log("Tracking ignored: User is Admin.");
        return; 
    }
    
    // 2. CHẶN CÁC TRANG CỦA ADMIN: Nếu đang xem trang /admin/..., KHÔNG TRACK.
    if (pathname.startsWith('/admin')) {
        console.log("Tracking ignored: Admin page.");
        return;
    }
    
    // 3. CHẶN CÁC TRANG AUTH: (Thường không cần track)
    if (pathname === '/login' || pathname === '/signup') {
        return;
    }

    // 4. KIỂM TRA SESSION TRONG SESSIONSTORAGE:
    // Chỉ tính 1 visit cho mỗi phiên làm việc (mở tab/trình duyệt mới), đổi trang trong phiên không cộng thêm
    const sessionKey = "kca_session_active";
    let isNewSession = false;
    if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "true");
        isNewSession = true;
    }

    const track = async () => {
      try {
        await axios.post("/api/analytics/track", {
          page: pathname,
          isNewSession,
          referrer: document.referrer || '',
        });
        console.log(`Tracked: ${pathname} (newSession: ${isNewSession})`);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response && e.response.status === 429) {
             console.log("Tracking error (ignore): Rate Limited.");
        } else {
             console.error("Tracking error:", e);
        }
      }
    };

    track();
    
    // Chỉ lắng nghe khi path thay đổi.
  }, [location.pathname, user]); // Phụ thuộc vào user để biết role

};

export default usePageTracking;