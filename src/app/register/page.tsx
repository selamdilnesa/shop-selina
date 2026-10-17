"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://api.escuelajs.co/api/v1";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          avatar: "https://i.imgur.com/LDy6l7T.png",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.id) {
        const message = Array.isArray(data?.message)
          ? data.message.join(" ")
          : String(data?.message || "");

        const normalizedMessage = message.toLowerCase();

        if (
          normalizedMessage.includes("email") &&
          (normalizedMessage.includes("exist") ||
            normalizedMessage.includes("already") ||
            normalizedMessage.includes("unique") ||
            normalizedMessage.includes("taken"))
        ) {
          setError(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          setError(
            message || "We couldn't create your account. Please try again."
          );
        }

        return;
      }

      setSuccess("Account created successfully! Redirecting to sign in...");

      setTimeout(() => {
        router.replace("/login");
      }, 1200);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-[#e8dfd2] bg-[#fffdf9] px-4 py-3 text-sm text-[#402b20] placeholder:text-[#a78655]/70 outline-none focus:border-[#a78655] focus:ring-1 focus:ring-[#a78655] disabled:opacity-60 dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:placeholder-[#c4b4a7]/60 dark:focus:border-[#c6a16b]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 py-12 transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
      <div className="w-full max-w-md rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655] dark:text-[#c6a16b]">
            Join Us
          </p>

          <h1 className="text-3xl font-semibold text-[#402b20] dark:text-[#faf7f2]">
            Create Account
          </h1>

          <p className="mt-3 text-sm text-[#786b60] dark:text-[#c4b4a7]">
            Create your Shop Selina account and get started.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={loading}
              className={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
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
              className={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
              disabled={loading}
              className={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              disabled={loading}
              className={inputStyle}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#402b20] py-3 font-medium text-white transition hover:bg-[#594031] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#786b60] dark:text-[#c4b4a7]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#a78655] hover:underline dark:text-[#c6a16b]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}