import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/*" element={<DashboardLayout userRole="admin" />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
}
