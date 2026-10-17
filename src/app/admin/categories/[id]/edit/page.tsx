"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCategories,
  updateCategory,
  type Category,
} from "@/services/productService";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#a78655] dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:placeholder-[#806b5b] dark:focus:border-[#c6a16b]";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        setError("Invalid category ID.");
        setLoading(false);
        return;
      }

      try {
        const categories = await getCategories();

        const foundCategory = categories.find(
          (item) => item.id === categoryId
        );

        if (!foundCategory) {
          setError("Category not found.");
          return;
        }

        setCategory(foundCategory);
        setName(foundCategory.name);
        setImage(foundCategory.image);
      } catch (error) {
        console.error("Load category error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load this category."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCategory();
  }, [categoryId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!category) {
      setError("No category is available to update.");
      return;
    }

    if (!name.trim() || !image.trim()) {
      setError("Please enter a category name and image URL.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateCategory(category.id, {
        name: name.trim(),
        image: image.trim(),
      });

      router.push("/admin");
    } catch (error) {
      console.error("Update category error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the category. Please try again."
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
            Edit Category
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#806f63] dark:text-[#c4b4a7]">
            Update the category information for your store.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-10 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
              Loading category...
            </p>
          ) : category ? (
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
                  placeholder="Category name"
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
                  {saving ? "Saving..." : "Save Changes"}
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
          ) : (
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="mt-5 rounded-lg bg-[#402b20] px-5 py-3 text-sm text-white dark:bg-[#c6a16b] dark:text-[#1c1613]"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
}