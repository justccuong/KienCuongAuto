import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Components & Layouts ---
import Layout from "./components/layouts/Layout";
import FixedChatButtons from "./components/input/FixedChatButton";
import AdminRoute from "./components/AdminRoute"; 
import ScrollToTop from "./components/ScrollToTop";
import usePageTracking from "./hooks/usePageTracking";

// --- IMPORT AUTH PROVIDER ---
import { AuthProvider } from "./context/AuthContext";

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

// Component con để chứa Routes và hooks
const AppContent = () => {
    usePageTracking(); // Hook chạy sau khi AuthProvider đã load

    return (
        <>
            <FixedChatButtons />
            <ScrollToTop />

            <Routes>
                {/* 1. AUTH ROUTES (Không có Layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* 2. MAIN ROUTES (Có Layout với Header/Footer) */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/home" replace />} />
                    
                    {/* Public Routes */}
                    <Route path="home" element={<Home />} />
                    <Route path="about-kien-cuong" element={<AboutKienCuong />} />
                    <Route path="branches" element={<BranchesPage />} />
                    <Route path="branches/:id" element={<BranchDetail />} />
                    <Route path="find-car" element={<FindCarPage />} />
                    <Route path="cars/:id" element={<CarDetail />} />
                    <Route path="account" element={<AccountPage />} />

                    {/* Admin Routes (Protected) */}
                    <Route element={<AdminRoute />}>
                        <Route path="admin" element={<AdminOverview />} />
                        <Route path="admin/add-car" element={<AddCar />} />
                        <Route path="admin/edit-car/:carId" element={<EditCar />} />
                    </Route>
                </Route>

                {/* 404 Fallback (Optional) */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;