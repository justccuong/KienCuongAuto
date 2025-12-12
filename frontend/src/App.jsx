import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Components & Layouts ---
import Layout from "./components/layouts/Layout";
import FixedChatButtons from "./components/input/FixedChatButton";
import AdminRoute from "./components/AdminRoute"; 

// --- Pages: Auth ---
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import AccountPage from "./pages/Auth/Account"; 

// --- Pages: Public ---
import Home from "./pages/Home/Home";
import AboutKienCuong from "./pages/About/AboutKienCuong";
import BranchesPage from "./pages/Branches/Branches";
import BranchDetail from "./pages/Branches/BranchDetail";
import FindCarPage from "./pages/Car/BuyCar";
import CarDetail from "./pages/Car/CarDetail";

// --- Pages: Admin ---
import AdminOverview from "./pages/Admin/Overview";
import AddCar from "./pages/Admin/AddCar";
import EditCar from "./pages/Admin/EditCar";

const App = () => {
  return (
    <Router>
      {/*some buttons*/}
      <FixedChatButtons />

      <Routes>
        {/* 1. KHU VỰC AUTH (Không có Header/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 2. KHU VỰC CÓ LAYOUT (Header + Footer) */}
        <Route path="/" element={<Layout />}>
          
          {/* --- Redirect mặc định --- */}
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />

          {/* --- Các trang công khai --- */}
          <Route path="about-kien-cuong" element={<AboutKienCuong />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:id" element={<BranchDetail />} />
          <Route path="find-car" element={<FindCarPage />} />
          <Route path="cars/:id" element={<CarDetail />} />

          <Route path="account" element={<AccountPage />} />

          {/*admin skibidi*/}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/add-car" element={<AddCar />} />
            <Route path="admin/edit-car/:carId" element={<EditCar />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;