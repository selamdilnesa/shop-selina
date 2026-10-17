"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getProducts,
  type Product,
} from "@/services/productService";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = String(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const products = await getProducts();

        const foundProduct = products.find(
          (item) => String(item.id) === productId
        );

        if (!foundProduct) {
          setError("Product not found.");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
        <p className="text-lg">Loading product details...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-6 py-12 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#eadfce] bg-white p-8 transition-colors dark:border-[#49372b] dark:bg-[#30231d]">
          <h1 className="text-2xl font-bold">Product Not Found</h1>

          <p className="mt-3 text-sm text-[#806f63] dark:text-[#c4b4a7]">
            {error || "We couldn't find this product."}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-block rounded-lg bg-[#402b20] px-5 py-3 text-sm text-white hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const image =
    product.images?.find(
      (url) => typeof url === "string" && url.trim() !== ""
    ) || "";

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#a78655] dark:text-[#c6a16b]">
            Shop Selina
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#402b20] dark:text-[#faf7f2]">
            Product Details
          </h1>

          <p className="mt-2 text-sm text-[#806f63] dark:text-[#c4b4a7]">
            View the information for this product.
          </p>

          <Link
            href="/admin/products"
            className="mt-5 inline-block text-sm font-medium text-[#806f63] hover:text-[#a78655] dark:text-[#c4b4a7] dark:hover:text-[#c6a16b]"
          >
            ← Back to Products
          </Link>
        </header>

        <section className="grid gap-8 rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-8 md:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center rounded-xl bg-[#faf7f2] p-6 transition-colors dark:bg-[#281d18]">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="max-h-80 w-full object-contain"
              />
            ) : (
              <p className="text-sm text-[#806f63] dark:text-[#c4b4a7]">
                No image available
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-[#a78655] dark:text-[#c6a16b]">
              Product ID: {product.id}
            </p>

            <h2 className="mt-3 text-2xl font-bold text-[#402b20] dark:text-[#faf7f2] sm:text-3xl">
              {product.title}
            </h2>

            <p className="mt-4 text-2xl font-semibold text-[#a78655] dark:text-[#c6a16b]">
              ${Number(product.price).toFixed(2)}
            </p>

            <div className="mt-6 border-t border-[#eadfce] pt-5 dark:border-[#49372b]">
              <h3 className="font-semibold text-[#402b20] dark:text-[#faf7f2]">
                Description
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#806f63] dark:text-[#c4b4a7]">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="mt-6 border-t border-[#eadfce] pt-5 dark:border-[#49372b]">
              <h3 className="font-semibold text-[#402b20] dark:text-[#faf7f2]">
                Category
              </h3>

              <p className="mt-2 text-sm text-[#806f63] dark:text-[#c4b4a7]">
                {product.category?.name || "Not available"}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="rounded-lg bg-[#402b20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
              >
                Edit Product
              </Link>

              <Link
                href="/admin/products"
                className="rounded-lg border border-[#eadfce] px-5 py-3 text-sm transition hover:bg-[#faf7f2] dark:border-[#49372b] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
              >
                Back to List
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}