"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  type Category,
} from "@/services/productService";

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();

      // Avoid showing duplicate category IDs.
      const uniqueCategories = Array.from(
        new Map(data.map((category) => [category.id, category])).values()
      );

      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Load categories error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 text-[#402b20] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655]">
              Shop Selina
            </p>

            <h1 className="mt-2 text-3xl font-bold">Categories</h1>

            <p className="mt-2 text-sm text-[#806f63]">
              Organize your products into categories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm transition hover:bg-[#f0e5d4]"
            >
              ← Dashboard
            </button>

            <button
              type="button"
              onClick={() => void loadCategories()}
              disabled={loading}
              className="rounded-lg border border-[#d4af6a] px-4 py-3 text-sm transition hover:bg-[#f0e5d4] disabled:opacity-60"
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/categories/new")}
              className="rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#604333]"
            >
              + Add Category
            </button>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#806f63]">Total Categories</p>

          <p className="mt-2 text-3xl font-bold">
            {loading ? "..." : categories.length}
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={() => void loadCategories()}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#eadfce] bg-white p-12 text-center">
            <p className="text-[#806f63]">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d4af6a] bg-white p-12 text-center">
            <p className="text-4xl">📂</p>

            <h2 className="mt-4 text-xl font-semibold">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-[#806f63]">
              Create your first category to organize your products.
            </p>

            <button
              type="button"
              onClick={() => router.push("/admin/categories/new")}
              className="mt-6 rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#604333]"
            >
              Create Category
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-48 items-center justify-center bg-[#f5eee4]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#a78655]">
                    Category #{category.id}
                  </p>

                  <h2 className="mt-2 truncate text-xl font-semibold">
                    {category.name}
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/admin/categories/${category.id}/edit`)
                    }
                    className="mt-5 w-full rounded-lg border border-[#d4af6a] px-4 py-3 text-sm font-medium transition hover:bg-[#faf7f2]"
                  >
                    Edit Category →
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
