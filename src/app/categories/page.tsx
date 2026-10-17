"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, Category } from "@/services/productService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => {
        const filtered = (data || []).filter(
          (cat) =>
            cat &&
            cat.name &&
            !cat.name.toLowerCase().includes("updated")
        );
        setCategories(filtered);
      })
      .catch(() => {
        setError("Could not load categories. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[#402b20] dark:text-[#faf7f2]">
          Our Categories
        </h1>

        <p className="mt-2 text-[#806c5d] dark:text-[#c4b4a7]">
          Explore our everyday essential collections.
        </p>

        {loading && (
          <section
            className="mt-8"
            aria-label="Loading categories"
            aria-busy="true"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e5d9c9] border-t-[#a78655] dark:border-[#49372b] dark:border-t-[#c6a16b]" />
              <p className="text-sm text-[#806c5d] dark:text-[#c4b4a7]">
                Preparing your collection...
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#e5d9c9] bg-white shadow-sm dark:border-[#49372b] dark:bg-[#30231d]"
                >
                  <div className="relative h-56 overflow-hidden bg-[#f0e9df] dark:bg-[#281d18]">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/10" />
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="relative h-5 w-2/3 overflow-hidden rounded-md bg-[#eee5d9] dark:bg-[#382a22]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/10" />
                    </div>

                    <div className="relative h-3 w-1/3 overflow-hidden rounded-md bg-[#f3ede5] dark:bg-[#382a22]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {error && (
          <div
            role="alert"
            className="mt-12 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="mt-12 rounded-xl border border-[#e5d9c9] bg-white p-8 text-center text-[#806c5d] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#c4b4a7]">
            No categories found.
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group overflow-hidden rounded-2xl border border-[#e5d9c9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#49372b] dark:bg-[#30231d]"
              >
                <div className="h-56 w-full overflow-hidden bg-[#f4f0e9] dark:bg-[#281d18]">
                  <img
                    src={category.image || "/placeholder.webp"}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold capitalize text-[#402b20] dark:text-[#faf7f2]">
                    {category.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}