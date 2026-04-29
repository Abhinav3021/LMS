"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { saveToken } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        form
      );

      saveToken(res.data.data.token);

      toast.success("Welcome back");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Login to continue
        </p>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Email"
            className="w-full rounded-lg border p-3"
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
            className="w-full rounded-lg border p-3"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </div>

        <button className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
          Login
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}