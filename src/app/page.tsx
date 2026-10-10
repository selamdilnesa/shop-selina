import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  images?: string[];
  category?: {
    name: string;
  };
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=4",
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return [];
    }

    const products: Product[] = await response.json();

    return products.filter(
      (product) =>
        product.id &&
        product.title &&
        typeof product.price === "number" &&
        product.images?.some(
          (image) =>
            typeof image === "string" &&
            image.startsWith("http") &&
            !image.includes("placeimg.com") &&
            !image.includes("placehold.co")
        )
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:py-24">
        <p className="text-sm uppercase tracking-widest text-amber-950">
          Welcome to
        </p>

        <h1 className="mb-2 text-4xl font-bold uppercase tracking-widest text-amber-950 sm:text-6xl">
          Shop Selina
        </h1>

        <div className="my-2 h-px w-16 bg-amber-700" />

        <p className="mt-2 text-lg tracking-wide text-amber-800 sm:text-2xl">
          Discover more. Shop smarter.
        </p>

        <p className="mt-2 max-w-xl text-sm leading-7 text-stone-700 sm:text-base">
          Discover a world of everyday essentials, electronics, and more.
          Find the things you love, explore something new, and make every
          shopping experience a little more special. Everything you need,
          all in one place.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-amber-950 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-amber-900"
          >
            Explore Products →
          </Link>

          <Link
            href="/categories"
            className="rounded-full border border-amber-950 px-6 py-3 font-medium text-amber-950 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-950 hover:text-white"
          >
            Browse Categories →
          </Link>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-amber-900/60">
          Your everyday favorites, all in one place
        </p>
      </main>

      {/* Featured Products Section */}
      <section className="px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-amber-800">
                A little something for you
              </p>

              <h2 className="font-serif text-3xl text-amber-950 sm:text-4xl">
                Featured Products
              </h2>

              <p className="mt-3 text-sm text-stone-600 sm:text-base">
                A glimpse of what you might love.
              </p>
            </div>

            <Link
              href="/products"
              className="w-fit border-b border-amber-800 pb-1 text-sm font-medium text-amber-950 transition hover:text-amber-700"
            >
              View All Products →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => {
                const productImage = product.images?.find(
                  (image) =>
                    typeof image === "string" &&
                    image.startsWith("http") &&
                    !image.includes("placeimg.com") &&
                    !image.includes("placehold.co")
                );

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f4f0e9] p-4 sm:p-6">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.title}
                            loading="lazy"
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-sm text-stone-500">
                            Image unavailable
                          </span>
                        )}

                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-950 sm:text-xs">
                          Featured
                        </span>
                      </div>

                      <div className="p-3 sm:p-5">
                        <p className="mb-2 truncate text-xs capitalize text-stone-500">
                          {product.category?.name || "Shop Selina"}
                        </p>

                        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-amber-950 transition group-hover:text-amber-700 sm:text-base">
                          {product.title}
                        </h3>

                        <p className="mt-3 text-base font-semibold text-amber-950 sm:text-lg">
                          ${product.price.toFixed(2)}
                        </p>

                        <span className="mt-4 inline-block text-xs font-medium text-amber-800 underline underline-offset-4 sm:text-sm">
                          View Product →
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e8dfd2] bg-white px-6 py-12 text-center">
              <p className="text-stone-600">
                Featured products are temporarily unavailable.
              </p>

              <Link
                href="/products"
                className="mt-4 inline-block font-medium text-amber-950 underline underline-offset-4"
              >
                Explore All Products →
              </Link>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-block rounded-full bg-amber-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-amber-900"
            >
              Shop All Products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}