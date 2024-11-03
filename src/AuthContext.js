// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    document.cookie = `authToken=${newToken}; path=/; secure; HttpOnly;`;
  };

  const logout = () => {
    setToken(null);
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
