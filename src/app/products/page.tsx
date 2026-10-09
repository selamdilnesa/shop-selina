import { getProducts } from "@/lib/products";
import Link from "next/link";
export default async function Products() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-800">
          Discover your favorites
        </p>

        <h1 className="text-4xl font-bold tracking-wide text-amber-950 sm:text-5xl">
          Our Products
        </h1>

        <p className="mt-4 max-w-xl leading-7 text-stone-600">
          Explore our collection of everyday essentials, electronics, and more.
          Find something you love at Shop Selina.
        </p>

        <div className="my-8 h-px w-full bg-amber-900/20" />

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
                className="overflow-hidden rounded-2xl border border-stone-200 border-amber-900/10 bg-white shadow-sm hover:shadow-xl translate-y-1 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-64 items-center justify-center bg-[#f4f0e9] p-5 relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-sm text-stone-500">
                      Image unavailable
                    </div>
                  )}
                  <button className="absolute right-4 top-4 rounded-lg bg-[#d4af6a] px-4 py-2 text-sm font-semibold text-amber-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#c49a4e] hover:shadow-lg active:translate-y-0">
                    🛍️Add to cart
                  </button>
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 font-semibold text-amber-950">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-sm capitalize text-stone-500">
                    {product.category?.name}
                  </p>

                  <p className="mt-4 text-xl font-bold text-amber-950">
                    ${product.price.toFixed(2)}
                  </p>

                  <Link
                   href={`/products/${product.id}`}
                   className="mt-4 block w-full rounded-full bg-amber-950 px-4 py-3 text-center font-medium text-white transition hover:bg-amber-800"
                   >
                  View Product →
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