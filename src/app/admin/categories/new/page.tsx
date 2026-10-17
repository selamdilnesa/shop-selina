"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/services/productService";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#a78655] dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:placeholder-[#806b5b] dark:focus:border-[#c6a16b]";

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
    <main className="min-h-screen bg-[#faf7f2] px-4 py-10 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="mb-6 text-sm text-[#806f63] transition hover:text-[#a78655] dark:text-[#c4b4a7] dark:hover:text-[#c6a16b]"
        >
          ← Back to Admin Dashboard
        </button>

        <div className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655] dark:text-[#c6a16b]">
            Shop Selina
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#402b20] dark:text-[#faf7f2]">
            Add New Category
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#806f63] dark:text-[#c4b4a7]">
            Create a category to help customers explore your products.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
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
                className="mb-2 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
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
                  className="mt-4 h-32 w-32 rounded-xl border border-[#eadfce] bg-[#faf7f2] object-cover dark:border-[#49372b] dark:bg-[#281d18]"
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
                className="rounded-lg bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#604333] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
              >
                {saving ? "Creating..." : "Create Category"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="rounded-lg border border-[#eadfce] px-6 py-3 text-sm transition hover:bg-[#faf7f2] dark:border-[#49372b] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}