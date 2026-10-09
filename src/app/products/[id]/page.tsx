import { getProducts } from "@/lib/products";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getProducts();

  const product = products.find(
    (item: { id: number }) => item.id === Number(id)
  );

  if (!product) {
    return <p className="p-10">Product not found.</p>;
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-xl bg-[#f4f0e9] p-8">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="max-h-96 w-full object-contain"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-800">
              {product.category?.name}
            </p>

            <h1 className="mt-4 text-3xl font-bold text-amber-950">
              {product.title}
            </h1>

            <p className="mt-6 text-2xl font-bold text-amber-950">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-6 leading-7 text-stone-600">
              {product.description}
            </p>

            <button className="mt-8 w-full rounded-full bg-amber-950 px-6 py-3 font-medium text-white transition hover:bg-amber-800">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
