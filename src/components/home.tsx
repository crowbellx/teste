import React from "react";
import LoginForm from "./auth/LoginForm";
import DashboardLayout from "./dashboard/DashboardLayout";
import { useAuth } from "@/lib/auth";

const Home = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = async (data: { username: string; password: string }) => {
    await login(data.username, data.password);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoginForm onSubmit={handleLogin} />
        </div>
      ) : (
        <DashboardLayout
          userName={user.username}
          userRole={user.role}
          onLogout={logout}
        />
      )}
    </div>
  );
};

export default Home;
