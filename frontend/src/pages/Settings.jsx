"use client";

import { AccountSettings } from "../components/settings/account-settings";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function SettingsPage() {
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

  return <AccountSettings />;
}
