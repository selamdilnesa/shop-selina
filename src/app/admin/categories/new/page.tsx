"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/services/productService";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#a78655]";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !image.trim()) {
      setError("Please enter a category name and image URL.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createCategory({
        name: name.trim(),
        image: image.trim(),
      });

      router.push("/admin");
    } catch (error) {
      console.error("Create category error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create the category. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10 text-[#402b20] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="mb-6 text-sm text-[#806f63] transition hover:text-[#a78655]"
        >
          ← Back to Admin Dashboard
        </button>

        <div className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655]">
            Shop Selina
          </p>

          <h1 className="mt-3 text-3xl font-bold">Add New Category</h1>

          <p className="mt-2 text-sm leading-6 text-[#806f63]">
            Create a category to help customers explore your products.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium"
              >
                Category Name
              </label>

              <input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Clothing"
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="category-image"
                className="mb-2 block text-sm font-medium"
              >
                Category Image URL
              </label>

              <input
                id="category-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/image.jpg"
                required
                className={inputStyle}
              />

              {image && (
                <img
                  src={image}
                  alt="Category preview"
                  className="mt-4 h-32 w-32 rounded-xl border border-[#eadfce] bg-[#faf7f2] object-cover"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.visibility = "visible";
                  }}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#604333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Category"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="rounded-lg border border-[#eadfce] px-6 py-3 text-sm transition hover:bg-[#faf7f2]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}