import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-600">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <a href="/home">
          <img src="/lib-hub-logo.png" alt="Logo" className="w-42 h-14" />
        </a>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl w-96">
        <p className="text-center text-2xl font-bold text-red-600 mb-6">
          Welcome back!
        </p>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-red-600 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-md border border-red-300 focus:ring-2 focus:ring-red-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative group">
            <label className="block text-red-600 font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 rounded-md border border-red-300 focus:ring-2 focus:ring-red-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-6 right-0.5 text-red-600"
            >
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-600 font-medium underline">
            Sign up!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
