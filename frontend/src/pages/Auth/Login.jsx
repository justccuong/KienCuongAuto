import React, { useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // 👇 QUAN TRỌNG: Lưu thông tin user vào LocalStorage
      // Để AdminRoute có cái mà kiểm tra
      if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Logic điều hướng thông minh (Optional)
        // Nếu là admin thì vào thẳng trang quản lý, user thường thì về Home
        if (res.data.user.role === 'admin') {
           navigate("/admin");
        } else {
           navigate("/home");
        }
      } else {
         // Fallback nếu không có role
         navigate("/home");
      }

    } catch (err) {
      console.error(err);
      // Hiển thị lỗi từ backend trả về (nếu có) cho chi tiết
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url('/banner/1.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md z-10 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Welcome back!
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500 text-center font-semibold bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-sm text-center text-gray-700 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;