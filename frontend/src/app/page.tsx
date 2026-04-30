import Link from "next/link";
import {
  FaArrowRight,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-white/20 px-4 py-2 text-sm text-slate-300">
          Secure • Fast • Scalable
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Loan
          <span className="text-blue-400"> Management System</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
          Streamline borrower onboarding, approvals,
          disbursement and collections with a
          beautiful full-stack lending platform.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600"
          >
            Login <FaArrowRight />
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <FaShieldAlt className="mb-3 text-2xl text-blue-400" />
            <h3 className="font-semibold">
              Secure Access
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              JWT authentication with role-based access.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <FaChartLine className="mb-3 text-2xl text-green-400" />
            <h3 className="font-semibold">
              Smart Operations
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Approvals, disbursement and collections.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <FaArrowRight className="mb-3 text-2xl text-purple-400" />
            <h3 className="font-semibold">
              Faster Workflow
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              End-to-end loan lifecycle automation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
