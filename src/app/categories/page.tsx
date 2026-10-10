import Link from "next/link";

type Product = {
id: number;
title: string;
price: number;
images: string[];
category: {
id: number;
name: string;
};
};

async function getProducts(): Promise<Product[]> {
try {
const response = await fetch(
"https://api.escuelajs.co/api/v1/products?offset=0&limit=200",
{ cache: "no-store" }
);


if (!response.ok) return [];

const products: Product[] = await response.json();

return products.filter(
  (product) =>
    product.category?.id &&
    product.category?.name &&
    Array.isArray(product.images) &&
    product.images.some(
      (image) =>
        typeof image === "string" &&
        image.startsWith("http") &&
        !image.includes("placeimg.com")
    )
);


} catch {
return [];
}
}

export default async function CategoryPage() {
const products = await getProducts();

const categoryMap = new Map<
number,
{ id: number; name: string; image: string; count: number }

> ();

products.forEach((product) => {
const categoryId = product.category.id;
const image = product.images.find(
(item) =>
typeof item === "string" &&
item.startsWith("http") &&
!item.includes("placeimg.com")
);


if (!image) return;

const existingCategory = categoryMap.get(categoryId);

if (existingCategory) {
  existingCategory.count += 1;
} else {
  categoryMap.set(categoryId, {
    id: categoryId,
    name: product.category.name,
    image,
    count: 1,
  });
}


});

const categories = Array.from(categoryMap.values());

return ( <main className="min-h-screen bg-[#faf7f2] px-4 py-12 sm:px-8 sm:py-16"> <div className="mx-auto max-w-7xl"> <header className="mb-12 text-center"> <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
Find Your choice </p>


      <h1 className="text-3xl font-semibold tracking-tight text-[#402b20] sm:text-5xl">
        Shop by Category
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#786b60] sm:text-base">
        Discover shop selina' scollections and find your next favorite.
      </p>
    </header>

    {categories.length > 0 ? (
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="group overflow-hidden rounded-2xl border border-[#e8dfd4] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden bg-[#f0e9df] sm:h-72">
              <img
                src={category.image}
                alt={`${category.name} collection`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="text-2xl font-semibold capitalize text-white">
                  {category.name}
                </h2>

                <p className="mt-1 text-sm text-white/90">
                  {category.count} products
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-sm font-medium text-[#402b20]">
                Explore Collection
              </span>

              <span className="text-xl text-[#a78655] transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-[#e8dfd4] bg-white px-6 py-12 text-center">
        <p className="text-lg font-medium text-[#402b20]">
          Products are temporarily unavailable.
        </p>

        <p className="mt-2 text-sm text-[#786b60]">
          Please check your connection and try again.
        </p>
      </div>
    )}

    <div className="mt-12 text-center">
      <Link
        href="/products"
        className="inline-flex rounded-full bg-[#402b20] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#5a3d2d]"
      >
        View All Products
      </Link>
    </div>
  </div>
</main>


);
}
