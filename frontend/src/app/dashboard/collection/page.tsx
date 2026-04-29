"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  FaMoneyCheckAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function CollectionPage() {
  const [loans, setLoans] =
    useState<any[]>([]);

  const [formMap, setFormMap] =
    useState<any>({});

  const [loading, setLoading] =
    useState(true);

  const loadLoans = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/dashboard/collection"
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

  const pay = async (id: string) => {
    const data = formMap[id];

    if (!data) return;

    await api.post(
      `/dashboard/collection/${id}/pay`,
      {
        utr: data.utr,
        amount: Number(
          data.amount
        ),
      }
    );

    loadLoans();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Collection Module
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading active loans...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        loans.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-500" />

            <h2 className="text-2xl font-semibold">
              No Active Loans
            </h2>

            <p className="mt-2 text-slate-500">
              No loans currently require
              collection or repayment tracking.
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
            <div>
              <h2 className="text-lg font-semibold">
                {
                  loan.borrowerId
                    ?.name
                }
              </h2>

              <p className="text-sm text-slate-500">
                Collection Account
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Total
                </p>
                <p className="font-semibold">
                  ₹
                  {
                    loan.totalRepayment
                  }
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Paid
                </p>
                <p className="font-semibold text-green-600">
                  ₹
                  {
                    loan.paidAmount
                  }
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Due
                </p>
                <p className="font-semibold text-red-500">
                  ₹
                  {
                    loan.outstandingAmount
                  }
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-3 md:grid-cols-2">
              <input
                placeholder="UTR Number"
                className="rounded-xl border p-3"
                onChange={(e) =>
                  setFormMap({
                    ...formMap,
                    [loan._id]: {
                      ...formMap[
                        loan._id
                      ],
                      utr:
                        e.target.value,
                    },
                  })
                }
              />

              <input
                placeholder="Amount"
                className="rounded-xl border p-3"
                onChange={(e) =>
                  setFormMap({
                    ...formMap,
                    [loan._id]: {
                      ...formMap[
                        loan._id
                      ],
                      amount:
                        e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* Action */}
            <button
              onClick={() =>
                pay(
                  loan._id
                )
              }
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
            >
              <FaMoneyCheckAlt />
              Record Payment
            </button>
          </div>
        ))}
    </main>
  );
}