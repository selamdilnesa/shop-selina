"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        setError(
          response.status === 401
            ? "Incorrect email or password. Please try again."
            : "Login failed. Please check your details and try again."
        );
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      await refreshUser();

      router.replace("/profile");
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
            Welcome Back
          </p>

          <h1 className="text-3xl font-semibold text-[#402b20]">
            Sign In
          </h1>

          <p className="mt-3 text-sm text-[#786b60]">
            Sign in to your Shop Selina account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 text-[#402b20] ">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full rounded-lg border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#a78655] disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full rounded-lg border border-[#e8dfd2] px-4 py-3 text-sm outline-none focus:border-[#a78655] disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#402b20] py-3 font-medium text-white transition hover:bg-[#594031] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#786b60]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#a78655] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}