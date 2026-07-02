"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AdminDashboard } from "@/components/AdminDashboard";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { PharmacistDashboard } from "@/components/PharmacistDashboard";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "doctor") return <DoctorDashboard />;
  if (user?.role === "pharmacist") return <PharmacistDashboard />;

  return <AdminDashboard />;
}
