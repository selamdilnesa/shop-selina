import { getProducts } from "@/lib/products";
import ProductsClient from "@/components/ProductsClient";

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

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655] dark:text-[#c6a16b]">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path
              d="M12 3 14.8 8.7 21 9.6 16.5 14l1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z"
              strokeLinejoin="round"
            />
          </svg>
          Discover your favorites
        </div>

        <h1 className="font-serif text-4xl font-semibold tracking-wide text-[#402b20] dark:text-[#faf7f2] sm:text-5xl">
          Our Collection
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#8b796c] dark:text-[#c4b4a7] sm:text-base">
          Explore our collection of everyday essentials, electronics, and more.
          Find something you love at Shop Selina.
        </p>

        <div className="my-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#e8dfd2] dark:bg-[#49372b]" />

          <svg
            className="h-5 w-5 text-[#b18a50] dark:text-[#c6a16b]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 8h12l1 13H5L6 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>

          <span className="h-px flex-1 bg-[#e8dfd2] dark:bg-[#49372b]" />
        </div>

        <ProductsClient products={products} />
      </div>
    </main>
  );
}