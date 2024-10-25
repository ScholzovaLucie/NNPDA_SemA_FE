import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/Login';
import Home from './components/Home';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <Router>
    <CssBaseline />
    <Container>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Chráněné trasy */}
            <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                    </Route>
            
            </Routes>
            </Container>
        </Router>
    );
}

export default App;
