"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: number;
  title: string;
  price: number | null;
  images: string[];
};

type ProductDetailsClientProps = {
  title: string;
  images: string[];
  product?: Product;
};

export default function ProductDetailsClient({
  title,
  images,
  product,
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);

  const validImage = images.find(
    (image) =>
      typeof image === "string" &&
      /^https?:\/\/\S+$/i.test(image.trim())
  );

  // Product image display
  if (!product) {
    return (
      <div className="flex min-h-[350px] items-center justify-center overflow-hidden border border-[#e8dfd2] bg-white p-8 transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:min-h-[500px] sm:p-12">
        {validImage && !imageFailed ? (
          <img
            src={validImage}
            alt={title}
            onError={() => setImageFailed(true)}
            className="max-h-[420px] w-full object-contain"
          />
        ) : (
          <div className="text-center">
            <span className="text-5xl">🛍️</span>
            <p className="mt-4 text-sm text-[#806b5b] dark:text-[#c4b4a7]">
              Product image unavailable
            </p>
          </div>
        )}
      </div>
    );
  }

  // Don't allow adding a product without a valid price.
  if (
    product.price === null ||
    !Number.isFinite(product.price) ||
    product.price < 0
  ) {
    return (
      <p className="mt-6 text-sm text-[#806b5b] dark:text-[#c4b4a7]">
        The price of this product is currently unavailable.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Quantity selector */}
      <div>
        <label
          htmlFor="product-quantity"
          className="mb-3 block text-sm font-medium text-[#402b20] dark:text-[#faf7f2]"
        >
          Quantity
        </label>

        <div className="flex w-fit items-center border border-[#d8c8b5] bg-white transition-colors dark:border-[#49372b] dark:bg-[#281d18]">
          <button
            type="button"
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="h-11 w-11 text-lg text-[#402b20] transition hover:bg-[#f3ece2] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
          >
            −
          </button>

          <input
            id="product-quantity"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (Number.isInteger(value) && value >= 1) {
                setQuantity(value);
              }
            }}
            onBlur={() => {
              setQuantity((current) =>
                Number.isInteger(current) && current >= 1
                  ? current
                  : 1
              );
            }}
            className="h-11 w-14 border-x border-[#e8dfd2] bg-white text-center text-sm text-[#402b20] outline-none transition-colors dark:border-[#49372b] dark:bg-[#281d18] dark:text-[#faf7f2]"
          />

          <button
            type="button"
            onClick={() =>
              setQuantity((current) => current + 1)
            }
            aria-label="Increase quantity"
            className="h-11 w-11 text-lg text-[#402b20] transition hover:bg-[#f3ece2] dark:text-[#faf7f2] dark:hover:bg-[#382a22]"
          >
            +
          </button>
        </div>
      </div>

      {/* Add selected quantity to cart */}
      <AddToCartButton
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          images: product.images,
        }}
        quantity={quantity}
      />

      <p className="text-xs text-[#806b5b] dark:text-[#c4b4a7]">
        Carefully selected for you · Shop Selina
      </p>
    </div>
  );
}