import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgottenPassword from "./components/ForgottenPassword";
import SetNewPassword from "./components/SetNewPassword";
import MainPage from "./components/MainPage";
import DeviceList from "./components/DeviceList";
import DeviceDetail from "./components/DeviceDetail";
import AssignSensor from "./components/AssignSensor";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="lg">
        <Routes>
          {/* Veřejné trasy */}
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
