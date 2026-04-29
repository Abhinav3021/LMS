"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      toast.success("Account created");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Join the lending platform.
        </p>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Full Name"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email Address"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </div>

        <button className="mt-6 w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800">
          Register
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}