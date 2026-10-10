"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  category?: {
    id?: number;
    name: string;
  };
  rating?: {
    rate: number;
    count: number;
  };
};

type ProductsClientProps = {
  products: Product[];
};

export default function ProductsClient({
  products,
}: ProductsClientProps) {
  const searchParams = useSearchParams();

  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Read the category selected on the Categories page.
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    setSelectedCategory(categoryFromUrl || "all");
  }, [searchParams]);

  // Get the available categories from the products.
  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  ).sort((a, b) => a.localeCompare(b));

  // Filter and sort the products.
  const filteredProducts = products
    .filter((product) => {
      const matchesTitle = product.title
        .toLowerCase()
        .includes(searchTitle.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.name === selectedCategory;

      const matchesMinPrice =
        minPrice === "" || product.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || product.price <= Number(maxPrice);

      return (
        matchesTitle &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") {
        return a.price - b.price;
      }

      if (sortOrder === "high-low") {
        return b.price - a.price;
      }

      return 0;
    });

  function clearFilters() {
    setSearchTitle("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("default");
    setShowPriceFilter(false);
  }

  const priceFilterActive = minPrice !== "" || maxPrice !== "";

  return (
    <>
      {/* Search and Filter Section */}
      <section className="mb-8 mt-8 rounded-2xl border border-[#e8dfd2] bg-white p-4 sm:mb-10 sm:mt-10 sm:p-7">
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a78655] sm:text-xs">
            Find your favorites
          </p>

          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <h2 className="font-serif text-xl text-[#402b20] sm:text-2xl">
              Refine Your Search
            </h2>

            <p
              className="text-xs text-[#8b796c] sm:text-sm"
              aria-live="polite"
            >
              Showing{" "}
              <span className="font-semibold text-[#402b20]">
                {filteredProducts.length}
              </span>{" "}
              of {products.length} products
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-[#e8dfd2] bg-[#faf7f2] px-3 transition focus-within:border-[#b18a50] focus-within:ring-2 focus-within:ring-[#b18a50]/10 sm:px-4">
            <svg
              className="h-5 w-5 shrink-0 text-[#a78655]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              id="product-search"
              type="search"
              value={searchTitle}
              onChange={(event) => setSearchTitle(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-[#402b20] outline-none placeholder:text-[#b2a396] sm:text-sm"
            />

            {searchTitle && (
              <button
                type="button"
                onClick={() => setSearchTitle("")}
                className="shrink-0 py-2 text-xs font-medium text-[#a78655] hover:text-[#402b20]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          <div>
            <label
              htmlFor="category-filter-mobile"
              className="mb-1.5 block text-xs font-medium text-[#76533c]"
            >
              Category
            </label>

            <select
              id="category-filter-mobile"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="w-full min-w-0 rounded-xl border border-[#e8dfd2] bg-white px-2.5 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-price-mobile"
              className="mb-1.5 block text-xs font-medium text-[#76533c]"
            >
              Sort by
            </label>

            <select
              id="sort-price-mobile"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full min-w-0 rounded-xl border border-[#e8dfd2] bg-white px-2.5 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            >
              <option value="default">Featured</option>
              <option value="low-high">Price: Low–High</option>
              <option value="high-low">Price: High–Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            aria-expanded={showPriceFilter}
            className={`col-span-2 flex min-h-11 items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
              priceFilterActive
                ? "border-[#b18a50] bg-[#faf7f2] text-[#402b20]"
                : "border-[#e8dfd2] bg-white text-[#402b20] hover:bg-[#faf7f2]"
            }`}
          >
            <span className="flex items-center gap-2">
              Price filter

              {priceFilterActive && (
                <span className="rounded-full bg-[#402b20] px-2 py-0.5 text-[10px] text-white">
                  Active
                </span>
              )}
            </span>

            <svg
              className={`h-4 w-4 transition-transform ${
                showPriceFilter ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showPriceFilter && (
            <div className="col-span-2 grid grid-cols-2 gap-3 rounded-xl bg-[#faf7f2] p-3">
              <div>
                <label
                  htmlFor="min-price-mobile"
                  className="mb-1.5 block text-xs font-medium text-[#76533c]"
                >
                  Min price ($)
                </label>

                <input
                  id="min-price-mobile"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="No minimum"
                  className="w-full min-w-0 rounded-lg border border-[#e8dfd2] bg-white px-3 py-3 text-base text-[#402b20] outline-none focus:border-[#b18a50]"
                />
              </div>

              <div>
                <label
                  htmlFor="max-price-mobile"
                  className="mb-1.5 block text-xs font-medium text-[#76533c]"
                >
                  Max price ($)
                </label>

                <input
                  id="max-price-mobile"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="No maximum"
                  className="w-full min-w-0 rounded-lg border border-[#e8dfd2] bg-white px-3 py-3 text-base text-[#402b20] outline-none focus:border-[#b18a50]"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="col-span-2 justify-self-start py-2 text-xs font-medium text-[#a78655] underline underline-offset-4 hover:text-[#402b20]"
          >
            Reset all filters
          </button>
        </div>

        {/* Desktop and Tablet Filters */}
        <div className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-4">
          <div>
            <label
              htmlFor="category-filter-desktop"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Category
            </label>

            <select
              id="category-filter-desktop"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="w-full rounded-xl border border-[#e8dfd2] bg-[#faf7f2] px-3 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="min-price-desktop"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Minimum price ($)
            </label>

            <input
              id="min-price-desktop"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="No minimum"
              className="w-full rounded-xl border border-[#e8dfd2] bg-[#faf7f2] px-3 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            />
          </div>

          <div>
            <label
              htmlFor="max-price-desktop"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Maximum price ($)
            </label>

            <input
              id="max-price-desktop"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="No maximum"
              className="w-full rounded-xl border border-[#e8dfd2] bg-[#faf7f2] px-3 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            />
          </div>

          <div>
            <label
              htmlFor="sort-price-desktop"
              className="mb-2 block text-sm font-medium text-[#402b20]"
            >
              Sort by price
            </label>

            <select
              id="sort-price-desktop"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-xl border border-[#e8dfd2] bg-[#faf7f2] px-3 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50]"
            >
              <option value="default">Default order</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-5 hidden justify-end sm:flex">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-[#402b20] px-5 py-2.5 text-sm font-medium text-[#402b20] transition hover:bg-[#402b20] hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {/* Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
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

                  <div className="absolute right-3 top-3 z-10">
                    <AddToCartButton product={product} />
                  </div>

                  <img
                    src="/logo.webp"
                    alt="Shop Selina"
                    className="absolute bottom-3 right-3 z-10 h-auto w-12 object-contain"
                  />
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 min-h-12 font-medium leading-6 text-[#402b20]">
                    {product.title}
                  </h2>

                  {product.rating && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm">
                      <svg
                        className="h-4 w-4 fill-[#c49a4e] text-[#c49a4e]"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="m12 2 3.1 6.3 6.9 1-5 4.9-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z" />
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

                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e8dfd2] bg-white px-6 py-16 text-center">
          <h2 className="font-serif text-2xl text-[#402b20]">
            No products found
          </h2>

          <p className="mt-3 text-sm text-[#8b796c]">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5b4030]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
}
