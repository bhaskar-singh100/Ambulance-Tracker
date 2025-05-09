"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { apiUrls, apiBaseUrl } from "@/apis/urls";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status whenever component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("access_token")
        : null;

    if (!token) {
      setIsLoggedIn(false);
      setUserName(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      // Decode token to get role and name
      const decoded = jwtDecode(token);
      setRole(decoded.role);

      // Verify with backend
      const response = await axios.get(
        `${apiBaseUrl}${apiUrls.authentication}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.user) {
        setIsLoggedIn(true);
        setUserName(response.data.user.name || "User");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsLoggedIn(false);
      sessionStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    sessionStorage.setItem("access_token", token);
    checkAuth();
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUserName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        role,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
