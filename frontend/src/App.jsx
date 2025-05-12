"use client";

import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import SharedNote from "./pages/SharedNote";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import axios from "axios";
import { useEffect, useState } from "react";

// Protected route component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

function ResetPasswordProtectRoute({ children }) {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(`/auth/validate-token/${token}`);
        if (res.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log(error);
        setIsValid(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return children;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password"
        element={
          <ResetPasswordProtectRoute>
            <ResetPassword />
          </ResetPasswordProtectRoute>
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          <ResetPasswordProtectRoute>
            <ResetPassword />
          </ResetPasswordProtectRoute>
        }
      />

      <Route path="/s/:token" element={<SharedNote />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
