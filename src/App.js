import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./components/Login";
import { CssBaseline, Container } from "@mui/material";
import ForgottenPassword from "./components/ForgottenPassword";
import SetNewPassword from "./components/SetNewPassword";
import DeviceList from "./components/DeviceList";
import DeviceDetail from "./components/DeviceDetail";
import AssignSensor from "./components/AssignSensor";
import MainPage from "./components/MainPage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotten-password" element={<ForgottenPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          {/* Chráněné trasy */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/device/:deviceId" element={<DeviceDetail />} />
            <Route path="/assign-sensor/:deviceId" element={<AssignSensor />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
