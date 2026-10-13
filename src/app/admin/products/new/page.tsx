"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCategories,
  getProducts,
  createProduct,
  uploadProductImage,
  type Category,
} from "@/services/productService";

const inputStyle =
  "w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none transition focus:border-[#a78655]";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);

        if (data.length > 0) {
          setCategoryId(String(data[0].id));
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `Unable to load categories: ${err.message}`
            : "Unable to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setFilePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setFilePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function handleImageFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImageUrl("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanImageUrl = imageUrl.trim();
    const numericPrice = Number(price);
    const numericCategoryId = Number(categoryId);

    if (
      !cleanTitle ||
      !cleanDescription ||
      !categoryId
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    if (!imageFile && !cleanImageUrl) {
      setError("Please provide an image URL or upload an image.");
      return;
    }

    if (cleanImageUrl && !imageFile) {
      try {
        const parsedUrl = new URL(cleanImageUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setError("Please enter a valid HTTP or HTTPS image URL.");
          return;
        }
      } catch {
        setError("Please enter a valid image URL.");
        return;
      }
    }

    const selectedCategory = categories.find(
      (category) => category.id === numericCategoryId
    );

    if (!selectedCategory) {
      setError("Please select a valid category.");
      return;
    }

    setSaving(true);

    try {
      const existingProducts = await getProducts();

      const duplicateProduct = existingProducts.some(
        (product) =>
          product.title.trim().toLowerCase() ===
          cleanTitle.toLowerCase()
      );

      if (duplicateProduct) {
        setError(
          "This product already exists. Please choose a different name."
        );
        return;
      }

      let finalImageUrl = cleanImageUrl;

      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile);
      }

      if (!finalImageUrl) {
        throw new Error("The image upload did not return an image URL.");
      }

      const createdProduct = await createProduct({
        title: cleanTitle,
        price: numericPrice,
        description: cleanDescription,
        categoryId: numericCategoryId,
        images: [finalImageUrl],
      });

      if (!createdProduct?.id) {
        throw new Error(
          "The API did not confirm that the product was created."
        );
      }

      setSuccess("Product created successfully! Redirecting...");

      window.setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("unique constraint") ||
        lowerMessage.includes("product.slug") ||
        lowerMessage.includes("sqlite_constraint_unique") ||
        lowerMessage.includes("duplicate key")
      ) {
        setError(
          "A product with this name or a similar name already exists. Please try another name."
        );
      } else {
        setError(
          message || "Unable to create the product. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const previewSource = imageFile ? filePreview : imageUrl.trim();

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 text-[#402b20] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655]">
            Shop Selina
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Add New Product
          </h1>

          <p className="mt-2 text-sm text-[#806f63]">
            Add a new product to your store.
          </p>

          <Link
            href="/admin/products"
            className="mt-5 inline-block text-sm font-medium text-[#806f63] transition hover:text-[#a78655]"
          >
            ← Back to Products
          </Link>
        </header>

        <section className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm sm:p-8">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="font-semibold">
                Unable to create product
              </p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Product Name *
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
                className={inputStyle}
                placeholder="e.g. iPhone Charger"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium"
              >
                Price (USD) *
              </label>

              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                className={inputStyle}
                placeholder="19.99"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description *
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={5}
                maxLength={2000}
                className={`${inputStyle} resize-y`}
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category *
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                disabled={loadingCategories || categories.length === 0}
                className={inputStyle}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No categories available"
                      : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {!loadingCategories && categories.length === 0 && (
                <p className="mt-2 text-xs text-[#806f63]">
                  No categories are available. Please try again later
                  or create a category first.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-medium"
              >
                Product Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  if (event.target.value) setImageFile(null);
                }}
                disabled={Boolean(imageFile)}
                className={inputStyle}
                placeholder="https://example.com/product.jpg"
              />

              <p className="mt-2 text-xs text-[#806f63]">
                Paste an image URL, or upload an image below.
              </p>
            </div>

            <div>
              <label
                htmlFor="imageFile"
                className="mb-2 block text-sm font-medium"
              >
                Upload From Your Computer
              </label>

              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className={`${inputStyle} file:mr-4 file:rounded-md file:border-0 file:bg-[#402b20] file:px-4 file:py-2 file:text-sm file:text-white`}
              />

              <p className="mt-2 text-xs text-[#806f63]">
                Images only, up to 5 MB.
              </p>

              {imageFile && (
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove uploaded image
                </button>
              )}

              {previewSource && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-[#806f63]">
                    Image Preview
                  </p>

                  <img
                    key={previewSource}
                    src={previewSource}
                    alt="Product preview"
                    className="h-40 w-40 rounded-xl border border-[#eadfce] bg-[#faf7f2] object-contain p-2"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.visibility = "visible";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#eadfce] pt-6">
              <button
                type="submit"
                disabled={
                  saving ||
                  loadingCategories ||
                  categories.length === 0
                }
                className="rounded-lg bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#604333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating Product..." : "Create Product"}
              </button>

              <Link
                href="/admin/products"
                className="rounded-lg border border-[#eadfce] px-6 py-3 text-sm transition hover:bg-[#faf7f2]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>

        <p className="mt-5 text-xs leading-5 text-[#806f63]">
          Uploaded images must be accepted by the image API and return a
          public URL to appear on the storefront. Shop Selina uses a
          shared public API, so avoid modifying or deleting existing
          shared products without authorization.
        </p>
      </div>
    </main>
  );
}
