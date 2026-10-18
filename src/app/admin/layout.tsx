"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [authLoading, user, router]);

  // Show a clean loading state while verifying permissions
  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] text-[#402b20] dark:bg-[#1c1613] dark:text-[#faf7f2]">
        <p className="text-sm">Verifying admin access...</p>
      </main>
    );
  }

 
  if (!user || user.role !== "admin") {
    return null;
  }

  // If they are an admin, render the requested admin page safely!
  return <>{children}</>;
}