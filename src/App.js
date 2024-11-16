import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
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
import ApiClient from "./services/ApiClient";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    ApiClient.setOnUnauthorized(() => {
      navigate("/login", {
        state: { message: "Vaše relace vypršela. Přihlaste se znovu." },
      });
    });
  }, [navigate]);

  return (
    <>
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
    </>
  );
}

export default AppWrapper;
