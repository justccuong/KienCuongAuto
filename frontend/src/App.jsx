import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import BranchDetail from "./pages/Branches/BranchDetail";
import AboutKienCuong from "./pages/About/AboutKienCuong";
import AddCar from "./pages/Admin/AddCar";
import CarDetail from "./pages/Car/CarDetail";

const App = () => {
    return(
        <div>
          <Router>
            <Routes>

              <Route path="/home" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/branches/:id" element={<BranchDetail />} />
              <Route path="/about-kien-cuong" element={<AboutKienCuong />} />
              <Route path="/admin/add-car" element={<AddCar />} />
              <Route path="/cars/:id" element={<CarDetail />} />
              <Route path="/" element={<Navigate to="/home" />} />

            </Routes>
          </Router>
        </div>
    )
}

export default App