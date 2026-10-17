"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BackToCollectionButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleBack() {
    if (isLoading) return;

    setIsLoading(true);
    router.push("/products");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={isLoading}
      aria-live="polite"
      className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#76533c] transition hover:text-[#b18a50] disabled:cursor-wait disabled:opacity-70 dark:text-[#c6a16b] dark:hover:text-[#d6b27c]"
    >
      {isLoading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          Loading products...
        </>
      ) : (
        <>
          <span>←</span>
          Back to Collection
        </>
      )}
    </button>
  );
}