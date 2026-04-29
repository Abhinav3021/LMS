"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaUniversity,
} from "react-icons/fa";

export default function DisbursementPage() {
  const [loans, setLoans] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadLoans = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/dashboard/disbursement"
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

  const releaseFunds = async (
    id: string
  ) => {
    await api.patch(
      `/dashboard/disbursement/${id}/release`
    );

    loadLoans();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Disbursement Queue
      </h1>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading sanctioned loans...
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
              No sanctioned loans are waiting
              for disbursement right now.
            </p>
          </div>
        )}

      {/* Loan Cards */}
      {!loading &&
        loans.map((loan) => (
          <div
            key={loan._id}
            className="rounded-2xl bg-white p-6 shadow-sm space-y-5"
          >
            <div className="flex items-start justify-between">
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

              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                Ready
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Loan Amount
                </p>

                <p className="text-lg font-semibold">
                  ₹{loan.amount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Total Payable
                </p>

                <p className="text-lg font-semibold">
                  ₹
                  {
                    loan.totalRepayment
                  }
                </p>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() =>
                releaseFunds(
                  loan._id
                )
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <FaUniversity />
              Release Funds
            </button>
          </div>
        ))}
    </main>
  );
}