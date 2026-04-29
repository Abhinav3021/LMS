"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaChartBar,
  FaUserCheck,
  FaMoneyBillWave,
  FaWallet,
  FaBuilding,
} from "react-icons/fa";

export default function DashboardSidebar({
  role,
}: {
  role: string;
}) {
  const pathname = usePathname();

  const items = [];

  if (
    role === "ADMIN" ||
    role === "SALES"
  ) {
    items.push({
      label: "Sales",
      href: "/dashboard/sales",
      icon: <FaChartBar />,
    });
  }

  if (
    role === "ADMIN" ||
    role === "SANCTION"
  ) {
    items.push({
      label: "Sanction",
      href: "/dashboard/sanction",
      icon: <FaUserCheck />,
    });
  }

  if (
    role === "ADMIN" ||
    role === "DISBURSEMENT"
  ) {
    items.push({
      label: "Disbursement",
      href: "/dashboard/disbursement",
      icon: <FaMoneyBillWave />,
    });
  }

  if (
    role === "ADMIN" ||
    role === "COLLECTION"
  ) {
    items.push({
      label: "Collection",
      href: "/dashboard/collection",
      icon: <FaWallet />,
    });
  }

  return (
    <aside className="hidden min-h-screen w-72 border-r bg-slate-950 p-6 text-white md:block">
      <div className="mb-10 flex items-center gap-3">
        <FaBuilding className="text-2xl text-blue-400" />
        <h2 className="text-xl font-bold">
          LoanOps
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-500 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}