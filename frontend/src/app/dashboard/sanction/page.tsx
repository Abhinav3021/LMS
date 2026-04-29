"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FaCheckCircle } from "react-icons/fa";

export default function SanctionPage() {
  const [loans, setLoans] =
    useState<any[]>([]);

  const [reasonMap, setReasonMap] =
    useState<any>({});

  const [loading, setLoading] =
    useState(true);

  const loadLoans = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/dashboard/sanction"
      );

      setLoans(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const approve = async (id: string) => {
    await api.patch(
      `/dashboard/sanction/${id}/approve`
    );

    loadLoans();
  };

  const reject = async (id: string) => {
    await api.patch(
      `/dashboard/sanction/${id}/reject`,
      {
        reason: reasonMap[id],
      }
    );

    loadLoans();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Sanction Queue
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading loans...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        loans.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-500" />

            <h2 className="text-2xl font-semibold">
              No Loans Pending
            </h2>

            <p className="mt-2 text-slate-500">
              There are currently no loan
              applications waiting for sanction.
            </p>
          </div>
        )}

      {/* Loan Cards */}
      {!loading &&
        loans.map((loan) => (
          <div
            key={loan._id}
            className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold">
                {
                  loan.borrowerId
                    ?.name
                }
              </h2>

              <p className="text-slate-500">
                {
                  loan.borrowerId
                    ?.email
                }
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                ₹{loan.amount}
              </div>

              <div>
                {
                  loan.tenureDays
                }{" "}
                Days
              </div>

              <div>
                ₹
                {
                  loan.totalRepayment
                }
              </div>
            </div>

            <input
              placeholder="Reject reason"
              className="w-full rounded-xl border p-3"
              onChange={(e) =>
                setReasonMap({
                  ...reasonMap,
                  [loan._id]:
                    e.target.value,
                })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={() =>
                  approve(
                    loan._id
                  )
                }
                className="rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  reject(
                    loan._id
                  )
                }
                className="rounded-xl bg-red-500 px-5 py-3 text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </main>
  );
}