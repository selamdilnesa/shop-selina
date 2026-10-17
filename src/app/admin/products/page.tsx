"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/services/productService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655] dark:text-[#c6a16b]">
              Shop Selina
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#402b20] dark:text-[#faf7f2]">
              Products Management
            </h1>

            <p className="mt-2 text-sm text-[#806f63] dark:text-[#c4b4a7]">
              View and manage the products in your store.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm transition hover:bg-[#f0e5d4] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-lg bg-[#402b20] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
            >
              + Add Product
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                All Products
              </h2>

              <p className="mt-1 text-sm text-[#806f63] dark:text-[#c4b4a7]">
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products by name"
              className="w-full rounded-lg border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#402b20] outline-none transition focus:border-[#a78655] dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2] dark:placeholder-[#806b5b] dark:focus:border-[#c6a16b] sm:max-w-xs"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-12 text-center text-sm text-[#806f63] dark:text-[#c4b4a7]">
              Loading products...
            </p>
          ) : error ? null : filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-semibold text-[#402b20] dark:text-[#faf7f2]">
                No products found.
              </p>

              <p className="mt-2 text-sm text-[#806f63] dark:text-[#c4b4a7]">
                Try another search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#eadfce] text-[#806f63] dark:border-[#49372b] dark:text-[#c4b4a7]">
                    <th className="px-4 py-4 font-medium">Product</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Price</th>
                    <th className="px-4 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f0e8dc] last:border-0 dark:border-[#382a22]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-12 w-12 rounded-lg bg-[#faf7f2] object-contain dark:bg-[#281d18]"
                            />
                          ) : (
                            <>
                              <img
                                src="/logo.webp"
                                alt={product.title}
                                className="h-12 w-12 rounded-lg bg-[#faf7f2] object-contain dark:hidden"
                              />
                              <img
                                src="/darkLogo.jpg"
                                alt={product.title}
                                className="hidden h-12 w-12 rounded-lg bg-[#281d18] object-contain dark:block"
                              />
                            </>
                          )}

                          <span className="max-w-xs font-medium text-[#402b20] dark:text-[#faf7f2]">
                            {product.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[#806f63] dark:text-[#c4b4a7]">
                        {product.category?.name || "Uncategorized"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#402b20] dark:text-[#faf7f2]">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-block rounded-lg border border-[#d4af6a] px-3 py-2 text-xs font-medium transition hover:bg-[#faf7f2] dark:border-[#c6a16b] dark:text-[#c6a16b] dark:hover:bg-[#382a22]"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}