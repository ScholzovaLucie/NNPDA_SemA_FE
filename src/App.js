import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgottenPassword from "./components/ForgottenPassword";
import SetNewPassword from "./components/SetNewPassword";
import MainLayout from "./components/MainLayout"; // Nová komponenta s bočním menu
import MainPage from "./pages/MainPage";
import AllDevicesPage from "./pages/AllDevicesPage";
import AllSensorsPage from "./pages/AllSensorsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Veřejné trasy */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Chráněné trasy */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my" element={<MainPage />} />
            <Route path="/devices" element={<AllDevicesPage />} />
            <Route path="/sensors" element={<AllSensorsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
