import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import DashboardLayout from "./dashboard/DashboardLayout";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <DashboardLayout
            userName={user.username}
            userRole={user.role}
            onLogout={logout}
          />
        }
      />
    </Routes>
  );
}
