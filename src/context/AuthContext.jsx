import { createContext, useContext, useState } from "react";
import { saveToken, getToken, clearToken } from "../utils/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());

  const login = (jwt) => {
    saveToken(jwt);
    setToken(jwt);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
