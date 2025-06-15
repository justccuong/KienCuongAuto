import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import BranchDetail from "./pages/Branches/BranchDetail";
import AboutKienCuong from "./pages/About/AboutKienCuong";
import AddCar from "./pages/Admin/AddCar";
import CarDetail from "./pages/Car/CarDetail";
import BranchesPage from "./pages/Branches/Branches";
import Layout from "./components/layouts/Layout"; // import Layout mới tạo
import EditCar from "./pages/Admin/EditCar";
import Signup from "./pages/Auth/SignUp";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route không cần header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* Routes có Header + Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:id" element={<BranchDetail />} />
          <Route path="about-kien-cuong" element={<AboutKienCuong />} />
          <Route path="admin/add-car" element={<AddCar />} />
          <Route path="admin/edit-car/:id" element={<EditCar />} />
          <Route path="cars/:id" element={<CarDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
