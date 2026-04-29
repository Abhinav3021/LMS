"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaFileAlt,
  FaMoneyBillWave,
  FaUserShield,
} from "react-icons/fa";

export default function BorrowerPage() {
  const [profile, setProfile] =
    useState<any>(null);

  const [loans, setLoans] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [brePassed, setBrePassed] =
    useState(false);

  const [breReasons, setBreReasons] =
    useState<string[]>([]);

  const [checkingBre, setCheckingBre] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  const [details, setDetails] =
    useState({
      fullName: "",
      pan: "",
      dob: "",
      monthlySalary: "",
      employmentMode:
        "SALARIED",
    });

  const [loanForm, setLoanForm] =
    useState({
      amount: 50000,
      tenureDays: 30,
    });

  const tenureOptions = [
    30, 60, 90, 120, 180, 270,
    365,
  ];

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        profileRes,
        loansRes,
      ] = await Promise.all([
        api.get("/borrower/me"),
        api.get("/loan/my-loans"),
      ]);

      setProfile(
        profileRes.data.data
      );

      setLoans(
        loansRes.data.data
      );
    } catch {
      toast.error(
        "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkEligibility =
    async () => {
      try {
        setCheckingBre(true);

        const payload = {
          fullName:
            details.fullName,
          pan: details.pan,
          dob: details.dob,
          monthlySalary:
            Number(
              details.monthlySalary
            ),
          employmentMode:
            details
              .employmentMode,
        };

        const res =
          await api.post(
            "/borrower/bre-check",
            payload
          );

        setBrePassed(
          res.data.data.passed
        );

        setBreReasons(
          res.data.data.reasons ||
            []
        );

        if (
          res.data.data.passed
        ) {
          const profileRes =
            await api.post(
              "/borrower/profile",
              payload
            );

          setProfile(
            profileRes.data.data
          );

          toast.success(
            "Eligible for loan"
          );
        } else {
          toast.error(
            "Eligibility failed"
          );
        }
      } catch (error: any) {
        const reasons =
          error?.response?.data
            ?.data?.reasons ||
          [
            error?.response?.data
              ?.message ||
              "BRE failed",
          ];

        setBrePassed(false);
        setBreReasons(reasons);
      } finally {
        setCheckingBre(false);
      }
    };

  const uploadSlip =
    async () => {
      if (!brePassed) {
        toast.error(
          "Complete BRE check first"
        );
        return;
      }

      if (!file) {
        toast.error(
          "Select file first"
        );
        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const res =
          await api.post(
          "/borrower/upload-slip",
          formData
        );

        setProfile(
          res.data.data
        );

        toast.success(
          "Salary slip uploaded"
        );

        setFile(null);
        await loadData();
      } catch {
        toast.error(
          "Upload failed"
        );
      }
    };

  const interest =
    useMemo(() => {
      return (
        (loanForm.amount *
          12 *
          loanForm.tenureDays) /
        (365 * 100)
      );
    }, [loanForm]);

  const total =
    loanForm.amount +
    interest;

  const applyLoan =
    async () => {
      if (!brePassed) {
        toast.error(
          "Pass eligibility check first"
        );
        return;
      }

      if (
        !profile
          ?.salarySlipUrl
      ) {
        toast.error(
          "Upload salary slip first"
        );
        return;
      }

      try {
        await api.post(
          "/loan/apply",
          {
            amount:
              loanForm.amount,
            tenureDays:
              loanForm.tenureDays,
          }
        );

        toast.success(
          "Loan applied"
        );

        loadData();
      } catch (error: any) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed"
        );
      }
    };

  const statusClass = (
    status: string
  ) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-700";
      case "SANCTIONED":
        return "bg-purple-100 text-purple-700";
      case "DISBURSED":
        return "bg-orange-100 text-orange-700";
      case "CLOSED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          <div className="rounded-2xl bg-white px-8 py-5 shadow">
            Loading...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* Header */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">
              Borrower Portal
            </h1>

            <p className="mt-2 text-slate-500">
              Complete eligibility,
              upload salary slip,
              apply for loan,
              track status.
            </p>
          </div>

          {/* BRE Section */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <FaUserShield className="text-blue-600" />
              <h2 className="text-xl font-semibold">
                Eligibility Check (BRE)
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="Full Name"
                className="rounded-xl border p-3"
                value={
                  details.fullName
                }
                onChange={(e) =>
                  setDetails({
                    ...details,
                    fullName:
                      e.target
                        .value,
                  })
                }
              />

              <input
                placeholder="PAN Number"
                className="rounded-xl border p-3 uppercase"
                value={
                  details.pan
                }
                onChange={(e) =>
                  setDetails({
                    ...details,
                    pan: e.target.value.toUpperCase(),
                  })
                }
              />

              <input
                type="date"
                className="rounded-xl border p-3"
                value={
                  details.dob
                }
                onChange={(e) =>
                  setDetails({
                    ...details,
                    dob: e.target
                      .value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Monthly Salary"
                className="rounded-xl border p-3"
                value={
                  details.monthlySalary
                }
                onChange={(e) =>
                  setDetails({
                    ...details,
                    monthlySalary:
                      e.target
                        .value,
                  })
                }
              />

              <select
                className="rounded-xl border p-3 md:col-span-2"
                value={
                  details.employmentMode
                }
                onChange={(e) =>
                  setDetails({
                    ...details,
                    employmentMode:
                      e.target
                        .value,
                  })
                }
              >
                <option value="SALARIED">
                  Salaried
                </option>
                <option value="SELF_EMPLOYED">
                  Self Employed
                </option>
                <option value="UNEMPLOYED">
                  Unemployed
                </option>
              </select>
            </div>

            <button
              onClick={
                checkEligibility
              }
              disabled={
                checkingBre
              }
              className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              {checkingBre
                ? "Checking..."
                : "Check Eligibility"}
            </button>

            {brePassed && (
              <div className="rounded-xl bg-green-50 p-4 text-green-700">
                <div className="flex items-center gap-2 font-semibold">
                  <FaCheckCircle />
                  Eligible for loan
                </div>
              </div>
            )}

            {!brePassed &&
              breReasons.length >
                0 && (
                <div className="rounded-xl bg-red-50 p-4 text-red-700">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <FaTimesCircle />
                    Rejected
                  </div>

                  <ul className="list-disc pl-5 text-sm">
                    {breReasons.map(
                      (
                        reason,
                        i
                      ) => (
                        <li
                          key={
                            i
                          }
                        >
                          {
                            reason
                          }
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>

          {/* Upload + Apply */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Upload */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <FaUpload className="text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Upload Salary Slip
                </h2>
              </div>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(
                    e.target
                      .files?.[0] ||
                      null
                  )
                }
              />

              <button
                onClick={
                  uploadSlip
                }
                className="w-full rounded-xl bg-blue-600 py-3 text-white"
              >
                Upload File
              </button>

              {profile
                ?.salarySlipUrl && (
                <a
                  href={`http://localhost:5000/uploads/${profile.salarySlipUrl}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-green-600 font-medium"
                >
                  <FaFileAlt />
                  View Uploaded Slip
                </a>
              )}
            </div>

            {/* Apply Loan */}
            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-green-600" />
                <h2 className="text-xl font-semibold">
                  Apply Loan
                </h2>
              </div>

              <div className="space-y-4">

                {/* Loan Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Loan Amount
                  </label>

                  <input
                    type="number"
                    min={50000}
                    max={500000}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border p-3"
                    value={loanForm.amount}
                    onChange={(e) =>
                      setLoanForm({
                        ...loanForm,
                        amount: Number(
                          e.target.value
                        ),
                      })
                    }
                  />

                  <p className="text-xs text-slate-500">
                    Minimum ₹50,000 • Maximum ₹5,00,000
                  </p>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Loan Tenure
                  </label>

                  <select
                    className="w-full rounded-xl border p-3"
                    value={loanForm.tenureDays}
                    onChange={(e) =>
                      setLoanForm({
                        ...loanForm,
                        tenureDays: Number(
                          e.target.value
                        ),
                      })
                    }
                  >
                    {tenureOptions.map(
                      (day) => (
                        <option
                          key={day}
                          value={day}
                        >
                          {day} Days
                        </option>
                      )
                    )}
                  </select>

                  <p className="text-xs text-slate-500">
                    Choose repayment duration
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm space-y-2">
                <p>
                  Interest:
                  ₹
                  {interest.toFixed(
                    2
                  )}
                </p>

                <p className="font-semibold">
                  Total Repayment:
                  ₹
                  {total.toFixed(
                    2
                  )}
                </p>
              </div>

              <button
                onClick={
                  applyLoan
                }
                className="w-full rounded-xl bg-green-600 py-3 text-white hover:bg-green-700"
              >
                Apply Loan
              </button>
            </div>
          </div>

          {/* Loan History */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold">
              My Loans
            </h2>

            {loans.length ===
            0 ? (
              <p className="text-slate-500">
                No loans applied yet.
              </p>
            ) : (
              <div className="space-y-4">
                {loans.map(
                  (
                    loan: any
                  ) => (
                    <div
                      key={
                        loan._id
                      }
                      className="rounded-xl border p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="grid gap-2 md:grid-cols-2 md:gap-x-8">
                          <p>
                            Amount:
                            ₹
                            {
                              loan.amount
                            }
                          </p>

                          <p>
                            Tenure:
                            {
                              loan.tenureDays
                            }{" "}
                            days
                          </p>

                          <p>
                            Total:
                            ₹
                            {
                              loan.totalRepayment
                            }
                          </p>

                          <p>
                            Paid:
                            ₹
                            {loan.paidAmount ||
                              0}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass(
                            loan.status
                          )}`}
                        >
                          {
                            loan.status
                          }
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
