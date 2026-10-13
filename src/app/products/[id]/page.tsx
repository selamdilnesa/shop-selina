import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductDetailsClient from "@/components/ProductDetailsClient";

type Product = {
id: number;
title: string;
price: number;
description?: string;
images?: string[];
category?: {
id?: number;
name?: string;
};
};

export default async function ProductDetailsPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;
const productId = Number(id);

if (!Number.isInteger(productId) || productId <= 0) {
notFound();
}

let products: Product[];

try {
products = await getProducts();
} catch {
throw new Error("Unable to load products. Please try again later.");
}

if (!Array.isArray(products)) {
throw new Error("Unable to load products. Please try again later.");
}

const product = products.find((item) => item.id === productId);

if (!product) {
notFound();
}

const relatedProducts = products
.filter(
(item) =>
item.id !== product.id &&
product.category?.id !== undefined &&
item.category?.id === product.category.id
)
.slice(0, 4);

const validImages = Array.isArray(product.images)
? product.images.filter(
(image): image is string =>
typeof image === "string" &&
/^https?:\/\/\S+$/i.test(image.trim()))

: [];

const safeProduct = {
id: product.id,
title:
typeof product.title === "string" && product.title.trim()
? product.title
: "Untitled Product",
price:
typeof product.price === "number" &&
Number.isFinite(product.price) &&
product.price >= 0
? product.price
: null,
images: validImages,
};

return ( <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-10 lg:px-16 lg:py-16"> <div className="mx-auto max-w-7xl"> <Link
       href="/products"
       className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#76533c] transition hover:text-[#b18a50]"
     > <span>←</span> Back to Collection </Link>

```
    <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductDetailsClient
        images={safeProduct.images}
        title={safeProduct.title}
      />

      <div className="flex flex-col justify-center py-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#a78655]">
          {product.category?.name || "Shop Selina Collection"}
        </p>

        <h1 className="mt-5 font-serif text-3xl leading-tight text-[#402b20] sm:text-4xl lg:text-5xl">
          {safeProduct.title}
        </h1>

        <p className="mt-6 font-serif text-3xl text-[#76533c]">
          {safeProduct.price !== null
            ? `$${safeProduct.price.toFixed(2)}`
            : "Price unavailable"}
        </p>

        <div className="my-8 border-t border-[#e8dfd2]" />

        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#402b20]">
          Product Description
        </h2>

        <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#8b796c]">
          {typeof product.description === "string" &&
          product.description.trim()
            ? product.description
            : "Discover something beautiful from our collection."}
        </p>

        <div className="mt-8 border-t border-[#e8dfd2] pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a78655]">
            Carefully selected for you
          </p>

          {safeProduct.price !== null ? (
            <ProductDetailsClient
              images={[]}
              title={safeProduct.title}
              product={safeProduct}
            />
          ) : (
            <p className="mt-4 text-sm text-[#8b796c]">
              This product cannot be added to your cart because its price
              is unavailable.
            </p>
          )}
        </div>

        <div className="mt-10 border-t border-[#e8dfd2] pt-6">
          <p className="font-serif text-lg italic text-[#76533c]">
            Shop Selina
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[#a78655]">
            Elegance in every detail
          </p>
        </div>
      </div>
    </div>

    {relatedProducts.length > 0 && (
      <section className="mt-20 border-t border-[#e8dfd2] pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
          Selected for you
        </p>

        <h2 className="mt-3 font-serif text-3xl text-[#402b20] sm:text-4xl">
          Related Products
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {relatedProducts.map((item) => {
            const image = Array.isArray(item.images)
              ? item.images.find(
                  (value) =>
                    typeof value === "string" &&
                    /^https?:\/\/\S+$/i.test(value.trim())
                )
              : undefined;

            return (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group overflow-hidden rounded-xl border border-[#e8dfd2] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-[#f4f0e9] p-3 sm:h-52">
                  {image ? (
                    <img
                      src={image}
                      alt={item.title || "Related product"}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs text-[#8b796c]">
                      Image unavailable
                    </span>
                  )}
                </div>

                <h3 className="mt-4 line-clamp-2 text-sm font-medium text-[#402b20]">
                  {item.title || "Untitled Product"}
                </h3>

                <p className="mt-2 text-lg font-semibold text-[#76533c]">
                  {typeof item.price === "number" &&
                  Number.isFinite(item.price) &&
                  item.price >= 0
                    ? `$${item.price.toFixed(2)}`
                    : "Price unavailable"}
                </p>

                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#a78655]">
                  View Product →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    )}

    <div className="mt-16 border-t border-[#e8dfd2] pt-8 text-center">
      <p className="font-serif text-2xl text-[#402b20]">
        Something else might catch your eye.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-flex bg-[#402b20] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#6a4936]"
      >
        Explore More Products
      </Link>
    </div>
  </div>
</main>


);
}
