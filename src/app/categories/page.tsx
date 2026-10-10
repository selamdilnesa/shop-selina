"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { getCategories, Category } from "@/services/productService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((data) => {
        // Filter out "updated" or invalid category names from the API
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
    <div className="min-h-screen bg-[#faf7f2] text-[#402b20]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Our Categories</h1>
        <p className="mt-2 text-[#806c5d]">
          Explore our everyday essential collections.
        </p>

        {loading && (
          <div className="mt-12 text-center text-[#806c5d]">
            Loading categories...
          </div>
        )}

        {error && (
          <div className="mt-12 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="mt-12 rounded-xl border border-[#e5d9c9] bg-white p-8 text-center text-[#806c5d]">
            No categories found.
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group overflow-hidden rounded-2xl border border-[#e5d9c9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-56 w-full overflow-hidden bg-[#f4f0e9]">
                  <img
                    src={category.image || "/placeholder.webp"}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold capitalize text-[#402b20]">
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