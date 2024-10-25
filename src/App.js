import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';  // Importujeme ThemeProvider a createTheme
import Register from './components/Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Home from './components/Home';

const theme = createTheme();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>  {/* Obalení aplikace do ThemeProvider */}
        <Router> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Všechny chráněné stránky obalíme do ProtectedRoute */}
            <Route path="/" element={<ProtectedRoute component={Home} />} />
            
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>

  );
}

export default App;
