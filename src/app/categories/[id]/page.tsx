import Link from "next/link";
import { notFound } from "next/navigation";

type Category = {
  id: number;
  name: string;
  image?: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  images?: string[];
};

const API_URL = "https://api.escuelajs.co/api/v1";

async function getCategory(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const category: Category = await response.json();

    if (!category.id || !category.name) return null;

    return category;
  } catch {
    return null;
  }
}

async function getCategoryProducts(id: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/products/?categoryId=${id}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return [];

    const products: Product[] = await response.json();

    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(id);

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-12 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back navigation */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-950 transition hover:text-amber-700 dark:text-[#c4b4a7] dark:hover:text-[#c6a16b]"
        >
          ← Back to Categories
        </Link>

        {/* Category heading */}
        <section className="mb-10 mt-8 border-b border-[#e8dfd2] pb-8 dark:border-[#49372b]">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-amber-800 dark:text-[#c6a16b]">
            Explore the collection
          </p>

          <h1 className="font-serif text-4xl capitalize text-[#402b20] dark:text-[#faf7f2] sm:text-5xl">
            {category.name}
          </h1>

          <p className="mt-4 text-sm text-stone-600 dark:text-[#c4b4a7] sm:text-base">
            Discover products from our {category.name} collection.
          </p>

          <p className="mt-3 text-xs text-stone-500 dark:text-[#c4b4a7]/80">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </section>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => {
              const image = product.images?.find(
                (item) =>
                  typeof item === "string" &&
                  /^https?:\/\/\S+$/i.test(item.trim()) &&
                  !item.includes("placeimg.com") &&
                  !item.includes("placehold.co")
              );

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#e8dfd2] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#d4af6a] hover:shadow-lg dark:border-[#49372b] dark:bg-[#30231d] dark:hover:border-[#c6a16b]"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#f4f0e9] p-4 dark:bg-[#281d18] sm:p-6">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-sm text-stone-500 dark:text-[#c4b4a7]">
                        Image unavailable
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-5">
                    <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-amber-950 transition group-hover:text-amber-700 dark:text-[#faf7f2] dark:group-hover:text-[#c6a16b] sm:text-base">
                      {product.title}
                    </h2>

                    <p className="mt-3 text-base font-semibold text-amber-950 dark:text-[#c6a16b] sm:text-lg">
                      ${product.price.toFixed(2)}
                    </p>

                    <span className="mt-4 inline-block text-xs font-medium text-amber-800 underline underline-offset-4 dark:text-[#c6a16b] sm:text-sm">
                      View Product →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e8dfd2] bg-white px-6 py-12 text-center transition-colors dark:border-[#49372b] dark:bg-[#30231d]">
            <h2 className="font-serif text-2xl text-[#402b20] dark:text-[#faf7f2]">
              No products available yet
            </h2>

            <p className="mt-3 text-sm text-stone-600 dark:text-[#c4b4a7]">
              There are currently no products in this collection.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-block rounded-full bg-amber-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-900 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
            >
              Explore All Products →
            </Link>
          </div>
        )}

        {/* Continue shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/categories"
            className="inline-block rounded-full border border-amber-950 px-7 py-3 text-sm font-medium text-amber-950 transition hover:bg-amber-950 hover:text-white dark:border-[#c6a16b] dark:text-[#c6a16b] dark:hover:bg-[#c6a16b] dark:hover:text-[#1c1613]"
          >
            Browse Other Categories
          </Link>
        </div>
      </div>
    </main>
  );
}