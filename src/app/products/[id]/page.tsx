import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category?: {
    name: string;
  };
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let products: Product[];

  try {
    products = await getProducts();
  } catch {
    throw new Error("Unable to load products. Please try again later.");
  }

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back to Products */}
        <Link
          href="/products"
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#76533c] transition hover:text-[#b18a50]"
        >
          <span>←</span> Back to Collection
        </Link>

        {/* Product Details */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="flex min-h-[350px] items-center justify-center border border-[#e8dfd2] bg-white p-8 sm:min-h-[500px] sm:p-12">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="max-h-[450px] w-full object-contain transition duration-500 hover:scale-105"
              />
            ) : (
              <p className="text-sm text-[#a78655]">
                Product image unavailable
              </p>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center py-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#a78655]">
              {product.category?.name || "Shop Selina Collection"}
            </p>

            <h1 className="mt-5 font-serif text-3xl leading-tight text-[#402b20] sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            <p className="mt-6 font-serif text-3xl text-[#76533c]">
              ${product.price.toFixed(2)}
            </p>

            <div className="my-8 border-t border-[#e8dfd2]" />

            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#402b20]">
              Product Description
            </h2>

            <p className="mt-4 text-sm leading-8 text-[#8b796c]">
              {product.description || "Discover something beautiful from our collection."}
            </p>

            <div className="mt-8 border-t border-[#e8dfd2] pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#a78655]">
                Carefully selected for you
              </p>

              {/* Connected Add to Cart Button */}
              <div className="relative mt-6 h-12">
                <AddToCartButton product={product} />
              </div>
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

        {/* Continue Shopping */}
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
