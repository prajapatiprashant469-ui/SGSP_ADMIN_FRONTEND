import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔐 VERIFY TOKEN ON APP LOAD
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token || token === "null") {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    localStorage.removeItem("authToken");

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "Invalid email or password");
    }

    const token =
      result?.data?.token ||
      result?.token ||
      result?.accessToken ||
      result?.jwt;

    if (!token) {
      throw new Error("Login succeeded but token missing");
    }

    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  // ⏳ Prevent flash redirect
  if (authLoading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
