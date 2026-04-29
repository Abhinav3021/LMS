"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function SalesPage() {
  const [search, setSearch] =
    useState("");

  const [leads, setLeads] =
    useState<any[]>([]);

  const loadLeads = async (
    value = ""
  ) => {
    try {
      const res = await api.get(
        `/dashboard/sales?search=${value}`
      );

      setLeads(res.data.data);
    } catch {
      toast.error("Access denied");
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <main className="p-8 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">
            Sales Leads
          </h1>

          <input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              const val =
                e.target.value;
              setSearch(val);
              loadLeads(val);
            }}
            className="rounded-xl border px-4 py-3"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>
              <th className="p-4 text-left">
                Email
              </th>
              <th className="p-4 text-left">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  {lead.name}
                </td>
                <td className="p-4">
                  {lead.email}
                </td>
                <td className="p-4">
                  {new Date(
                    lead.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}