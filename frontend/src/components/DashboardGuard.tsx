"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCurrentUser } from "@/lib/user";

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }

        const user =
          await getCurrentUser();

        if (
          user.role === "BORROWER"
        ) {
          router.push("/borrower");
          return;
        }

        setLoading(false);
      } catch {
        router.push("/login");
      }
    };

    check();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-8 py-5 shadow-md">
          <p className="text-lg font-semibold">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}