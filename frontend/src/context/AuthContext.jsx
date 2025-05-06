"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the authentication context
const AuthContext = createContext();

// Sample user data for demonstration
const sampleUsers = [
  {
    id: "1",
    name: "test",
    email: "test@gmail.com",
    password: "password", // In a real app, this would be hashed
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));

      if (storedUser) {
        const isValid = await validateUser(storedUser.email, storedUser.token);
        if (isValid) {
          setCurrentUser(storedUser);
        } else {
          localStorage.removeItem("currentUser");
        }
      }

      setLoading(false);
    };
    checkUser();
  }, []);
  const validateUser = async (email, token) => {
    try {
      const res = await axios.post(
        "/note/validate/user",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.status === 200;
    } catch (error) {
      console.error(
        "User validation failed:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  // Login function

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("auth/login", { email, password })
        .then((response) => {
          const { token, expiresIn } = response.data;

          const user = {
            email,
            token,
            expiresAt: Date.now() + expiresIn,
          };

          setCurrentUser(user);
          localStorage.setItem("currentUser", JSON.stringify(user));

          resolve(user);
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message || "Invalid email or password";
          reject(new Error(message));
        });
    });
  };

  // Register function
  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("auth/signup", { name, email, password })
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            reject(new Error("Registration failed"));
          }
        })
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "Registration failed. Please try again.";
          reject(new Error(message));
        });
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
