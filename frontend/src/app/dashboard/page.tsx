"use client";

import { useEffect, useState } from "react";
import DashboardGuard from "@/components/DashboardGuard";
import DashboardSidebar from "@/components/DashboardSidebar";
import { getCurrentUser } from "@/lib/user";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

import {
  FaUserShield,
  FaUsers,
  FaMoneyCheckAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardPage() {
  const [user, setUser] =
    useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const logoutUser = () => {
    logout();
    router.push("/login");
  };

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-4 shadow">
          Loading Dashboard...
        </div>
      </div>
    );

  return (
    <DashboardGuard>
      <main className="flex min-h-screen bg-slate-100">
        <DashboardSidebar role={user.role} />

        <section className="flex-1 p-8">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Welcome Back
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                {user.name}
              </h1>

              <p className="mt-1 text-sm text-blue-600 font-medium">
                {user.role}
              </p>
            </div>

            <button
              onClick={logoutUser}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <FaUserShield className="mb-4 text-2xl text-blue-500" />
              <p className="text-sm text-slate-500">
                Current Role
              </p>
              <h2 className="text-2xl font-bold">
                {user.role}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <FaUsers className="mb-4 text-2xl text-green-500" />
              <p className="text-sm text-slate-500">
                Accessible Modules
              </p>
              <h2 className="text-2xl font-bold">
                {user.role === "ADMIN" ? "4" : "1"}
              </h2>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <FaMoneyCheckAlt className="mb-4 text-2xl text-purple-500" />
              <p className="text-sm text-slate-500">
                System Status
              </p>
              <h2 className="text-2xl font-bold text-green-600">
                Active
              </h2>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">
              Dashboard Overview
            </h3>

            <p className="mt-3 text-slate-600 leading-7">
              Use the sidebar to manage leads,
              approvals, disbursements, and
              collections. This platform is built
              for seamless internal loan operations.
            </p>
          </div>
        </section>
      </main>
    </DashboardGuard>
  );
}