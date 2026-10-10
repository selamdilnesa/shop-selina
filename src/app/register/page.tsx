"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();

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

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
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
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      // Step 1: Create the account
      const registerResponse = await fetch(
        "https://api.escuelajs.co/api/v1/users/",
        {
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
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok || !registerData.id) {
        setError(
          registerResponse.status === 400
            ? "This email may already be registered. Try logging in."
            : registerData.message || "Registration failed. Please try again."
        );
        return;
      }

      // Step 2: Log in automatically
      const loginResponse = await fetch(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      const loginData = await loginResponse.json();

      if (
        !loginResponse.ok ||
        !loginData.access_token ||
        !loginData.refresh_token
      ) {
        setError(
          "Your account was created, but automatic login failed. Please sign in."
        );
        return;
      }

      // Step 3: Get the authenticated user's details
      const profileResponse = await fetch(
        "https://api.escuelajs.co/api/v1/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${loginData.access_token}`,
          },
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok || !profileData.id) {
        setError(
          "Your account was created, but we couldn't load your profile. Please sign in."
        );
        return;
      }

      // Step 4: Save authentication and profile information
      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("refresh_token", loginData.refresh_token);
      localStorage.setItem("custom_profile_name", cleanName);

      // Step 5: Update the app's authentication state immediately
      setAuthenticatedUser({
        id: profileData.id,
        name: cleanName,
        email: profileData.email || cleanEmail,
      });

      // Step 6: Go directly to the profile page
      setSuccess("Account created successfully! Redirecting to your profile...");

      router.replace("/profile");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-[#e8dfd2] bg-[#fffdf9] px-4 py-3 text-sm text-[#402b20] placeholder:text-[#a78655]/70 outline-none focus:border-[#a78655] focus:ring-1 focus:ring-[#a78655] disabled:opacity-60";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
            Join Us
          </p>

          <h1 className="text-3xl font-semibold text-[#402b20]">
            Create Account
          </h1>

          <p className="mt-3 text-sm text-[#786b60]">
            Create your Shop Selina account and get started.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#402b20]"
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
              className={inputStyle}
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
              className="mb-2 block text-sm font-medium text-[#402b20]"
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
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#402b20] py-3 font-medium text-white transition hover:bg-[#594031] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#786b60]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#a78655] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

