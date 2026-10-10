"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  getProducts,
  createProduct,
  type Product,
} from "@/services/productService";

const menuItems = [
  "Overview",
  "Products",
  "Categories",
  "Users",
  "Orders",
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [imageUrl, setImageUrl] = useState("");

  async function loadProducts() {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
      setError("");
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddProduct(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await createProduct({
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
        categoryId: Number(categoryId),
        images: [imageUrl.trim()],
      });

      await loadProducts();

      setTitle("");
      setPrice("");
      setDescription("");
      setCategoryId("1");
      setImageUrl("");
      setShowAddForm(false);
      setSuccessMessage("Product added successfully!");
    } catch {
      setError("Unable to add the product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    {
      title: "Total Products",
      value: loading ? "..." : error ? "—" : products.length,
      icon: "🛍️",
    },
    { title: "Total Categories", value: "—", icon: "📂" },
    { title: "Total Users", value: "—", icon: "👥" },
    { title: "Total Orders", value: "—", icon: "📦" },
  ];

  return (
    <main className="min-h-screen bg-[#faf7f2] p-4 text-[#402b20] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655]">
              Shop Selina
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#806f63]">
              Manage your store from one place.
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg border border-[#d4af6a] px-4 py-2 transition hover:bg-[#f0e5d4]"
          >
            View Store →
          </a>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#806f63]">
                  {stat.title}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h2 className="mt-4 text-3xl font-bold">
                {stat.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
            <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[#a78655]">
              Management
            </h2>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveTab(item);
                    setShowAddForm(false);
                    setSuccessMessage("");
                    setError("");
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeTab === item
                      ? "bg-[#402b20] text-white"
                      : "text-[#402b20] hover:bg-[#faf7f2]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="min-w-0 rounded-2xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-[#eadfce] pb-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  {activeTab}
                </h2>

                {activeTab === "Products" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm((current) => !current);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="rounded-lg bg-[#402b20] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#604333]"
                  >
                    {showAddForm ? "Cancel" : "+ Add Product"}
                  </button>
                )}
              </div>

              <p className="mt-2 text-sm text-[#806f63]">
                {activeTab === "Overview"
                  ? "Welcome to your Shop Selina administration area."
                  : `Manage your store's ${activeTab.toLowerCase()} here.`}
              </p>
            </div>

            {successMessage && (
              <p
                role="status"
                className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"
              >
                {successMessage}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="rounded-xl bg-[#faf7f2] p-6">
                <h3 className="text-lg font-semibold">
                  Welcome back! 🤎
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#806f63]">
                  Use the sidebar to manage products, categories,
                  users, and orders.
                </p>
                {loading && (
                  <p className="mt-4 text-sm text-[#806f63]">
                    Loading store statistics...
                  </p>
                )}
              </div>
            )}

            {/* Products */}
            {activeTab === "Products" && (
              <div>
                {showAddForm && (
                  <form
                    onSubmit={handleAddProduct}
                    className="mb-8 rounded-2xl border border-[#eadfce] bg-[#faf7f2] p-5 sm:p-6"
                  >
                    <h3 className="mb-5 text-xl font-bold">
                      Add a New Product
                    </h3>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-title"
                          className="mb-2 block text-sm font-medium"
                        >
                          Product Name
                        </label>
                        <input
                          id="product-title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter product name"
                          required
                          className="w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 outline-none focus:border-[#a78655]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="product-price"
                          className="mb-2 block text-sm font-medium"
                        >
                          Price ($)
                        </label>
                        <input
                          id="product-price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="49.99"
                          required
                          className="w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 outline-none focus:border-[#a78655]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="product-category"
                          className="mb-2 block text-sm font-medium"
                        >
                          Category ID
                        </label>
                        <input
                          id="product-category"
                          type="number"
                          min="1"
                          value={categoryId}
                          onChange={(e) =>
                            setCategoryId(e.target.value)
                          }
                          required
                          className="w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 outline-none focus:border-[#a78655]"
                        />
                        <p className="mt-1 text-xs text-[#806f63]">
                          Use an existing category ID.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-image"
                          className="mb-2 block text-sm font-medium"
                        >
                          Image URL
                        </label>
                        <input
                          id="product-image"
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          required
                          className="w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 outline-none focus:border-[#a78655]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="product-description"
                          className="mb-2 block text-sm font-medium"
                        >
                          Description
                        </label>
                        <textarea
                          id="product-description"
                          value={description}
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                          placeholder="Describe your product"
                          rows={4}
                          required
                          className="w-full resize-y rounded-lg border border-[#eadfce] bg-white px-4 py-3 outline-none focus:border-[#a78655]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-6 rounded-lg bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#604333] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Adding Product..." : "Save Product"}
                    </button>
                  </form>
                )}

                {loading && (
                  <p className="py-8 text-center text-[#806f63]">
                    Loading products...
                  </p>
                )}

                {!loading && !error && products.length === 0 && (
                  <p className="py-8 text-center text-[#806f63]">
                    No products found.
                  </p>
                )}

                {!loading && products.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#eadfce] text-[#806f63]">
                          <th className="px-3 py-4">Product</th>
                          <th className="px-3 py-4">Category</th>
                          <th className="px-3 py-4">Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-[#f0e8dc] last:border-0"
                          >
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    product.images?.[0] ||
                                    "/logo.webp"
                                  }
                                  alt={product.title}
                                  className="h-12 w-12 rounded-lg bg-[#faf7f2] object-contain"
                                />
                                <span className="max-w-[220px] truncate font-medium">
                                  {product.title}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-4 text-[#806f63]">
                              {product.category?.name ||
                                "Uncategorized"}
                            </td>

                            <td className="px-3 py-4 font-semibold">
                              ${product.price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Other Sections */}
            {!["Overview", "Products"].includes(activeTab) && (
              <div className="rounded-xl bg-[#faf7f2] p-6">
                <h3 className="font-semibold">
                  {activeTab} Management
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#806f63]">
                  We'll implement this section next.
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
