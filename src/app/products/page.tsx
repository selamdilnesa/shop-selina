import { getProducts } from "@/lib/products";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
id: number;
title: string;
price: number;
description?: string;
images?: string[];
category?: {
name: string;
};
rating?: {
rate: number;
count: number;
};
};

export default async function Products() {
const products: Product[] = await getProducts();

return ( <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-12 sm:py-16"> <div className="mx-auto max-w-7xl"> <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]"> <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"> <path d="M12 3 14.8 8.7 21 9.6 16.5 14l1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z" strokeLinejoin="round" /> </svg>
Discover your favorites </div>

```
    <h1 className="font-serif text-4xl font-semibold tracking-wide text-[#402b20] sm:text-5xl">
      Our Collection
    </h1>

    <p className="mt-4 max-w-xl text-sm leading-7 text-[#8b796c] sm:text-base">
      Explore our collection of everyday essentials, electronics, and more.
      Find something you love at Shop Selina.
    </p>

    <div className="my-8 flex items-center gap-3">
      <span className="h-px flex-1 bg-[#e8dfd2]" />
      <svg className="h-5 w-5 text-[#b18a50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
      <span className="h-px flex-1 bg-[#e8dfd2]" />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const imageUrl = product.images?.find(
          (image) =>
            typeof image === "string" &&
            image.trim() !== "" &&
            image !== "https://placehold.co/600x400"
        );

        return (
          <article
            key={product.id}
            className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative flex h-64 items-center justify-center bg-[#f4f0e9] p-5">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-sm text-stone-500">
                  Image unavailable
                </div>
              )}

              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#76533c]">
                {product.category?.name || "Collection"}
              </span>


              <AddToCartButton product={product} />
            </div>

            <div className="p-5">
              <h2 className="line-clamp-2 min-h-12 font-medium leading-6 text-[#402b20]">
                {product.title}
              </h2>

              {product.rating && (
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <svg className="h-4 w-4 fill-[#c49a4e] text-[#c49a4e]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1L12 2Z" />
                  </svg>
                  <span className="font-semibold text-[#76533c]">
                    {product.rating.rate.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <p className="mt-3 text-xl font-semibold text-[#402b20]">
                ${product.price.toFixed(2)}
              </p>

              <Link
                href={`/products/${product.id}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#402b20] px-4 py-3 text-sm font-medium text-[#402b20] transition hover:bg-[#402b20] hover:text-white"
              >
                View Product
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  </div>
</main>

);
}
