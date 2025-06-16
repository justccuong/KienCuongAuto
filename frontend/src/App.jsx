import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import BranchDetail from "./pages/Branches/BranchDetail";
import AboutKienCuong from "./pages/About/AboutKienCuong";
import AddCar from "./pages/Admin/AddCar";
import CarDetail from "./pages/Car/CarDetail";
import BranchesPage from "./pages/Branches/Branches";
import Layout from "./components/layouts/Layout";
import EditCar from "./pages/Admin/EditCar";
import Signup from "./pages/Auth/SignUp";
import AdminOverview from "./pages/Admin/Overview";
import FindCarPage from "./pages/Car/BuyCar";
import AccountPage from "./pages/Auth/Account";

import FixedChatButtons from "./components/input/FixedChatButton"; // 👈 Thêm dòng này

const App = () => {
  return (
    <Router>
      <FixedChatButtons /> {/* 👈 Thêm 2 nút cố định ở đây */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:id" element={<BranchDetail />} />
          <Route path="about-kien-cuong" element={<AboutKienCuong />} />
          <Route path="admin/add-car" element={<AddCar />} />
          <Route path="/admin/edit-car/:carId" element={<EditCar />} />
          <Route path="cars/:id" element={<CarDetail />} />
          <Route path="admin" element={<AdminOverview />} />
          <Route path="find-car" element={<FindCarPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
