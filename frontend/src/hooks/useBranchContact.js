import { useState, useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import api from "../utils/axios";

// Cache danh sách chi nhánh để tránh gọi lại API /branches nhiều lần
let branchesCache = null;

const useBranchContact = () => {
  const location = useLocation();
  const [branchInfo, setBranchInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndMatch = async () => {
      // 1. Fetch branches nếu chưa có trong cache
      if (!branchesCache) {
        try {
          const res = await api.get("/branches");
          branchesCache = res.data;
        } catch (err) {
          console.error("Lỗi fetch branches:", err);
          return;
        }
      }

      if (!isMounted || !branchesCache) return;

      const path = location.pathname;
      let matchedBranch = null;

      // 2. Kiểm tra nếu đang ở trang chi tiết xe
      const carMatch = matchPath("/cars/:id", path);
      if (carMatch) {
        try {
          const carRes = await api.get(`/cars/detail/${carMatch.params.id}`);
          const branchName = carRes.data.car.branch;
          matchedBranch = branchesCache.find(b => b.name === branchName);
        } catch (err) {
          console.error("Lỗi lấy thông tin xe:", err);
        }
      } else {
        // 3. Kiểm tra nếu đang ở trang chi nhánh
        const branchMatch = matchPath("/branches/:id", path);
        if (branchMatch) {
          matchedBranch = branchesCache.find(b => b.id === branchMatch.params.id || b._id === branchMatch.params.id);
        }
      }

      // 4. Nếu không match được, lấy chi nhánh đầu tiên làm mặc định
      if (!matchedBranch && branchesCache.length > 0) {
        matchedBranch = branchesCache[0];
      }

      if (isMounted && matchedBranch) {
        setBranchInfo(matchedBranch);
      }
    };

    fetchAndMatch();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return branchInfo;
};

export default useBranchContact;
