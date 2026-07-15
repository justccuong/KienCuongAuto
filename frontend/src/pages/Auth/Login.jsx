import React, { useState } from "react";
import api from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // ✅ IMPORT AUTH CONTEXT

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ GET setUser from context

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

      if (res.data && res.data.user) {
        // ✅ Update BOTH localStorage AND AuthContext
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user); // ✅ THIS IS THE KEY FIX!
        
        // Navigate based on role
        if (res.data.user.role === 'admin') {
           navigate("/admin");
        } else {
           navigate("/home");
        }
      } else {
         navigate("/home");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Email hoặc mật khẩu không đúng");
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
          Chào mừng trở lại!
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 shadow-md transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-sm text-center text-gray-700 mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-red-600 hover:underline font-medium">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;