import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    const result = await response.json();
  
    if (!response.ok || !result.success) {
      throw new Error("Invalid email or password");
    }
  
    // Extract token
    const token = result.data?.token;
  
    if (!token) {
      throw new Error("No token received");
    }
  
    // Save token
    localStorage.setItem("authToken", token);
  
    setIsAuthenticated(true);
  };
  

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
