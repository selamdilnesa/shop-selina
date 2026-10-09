"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
};

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart, cart } = useCart();
  const [showMessage, setShowMessage] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  function handleAddToCart() {
    addToCart(product);

    setAddedCount(
      cart.reduce((total, item) => total + item.quantity, 0) + 1
    );

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full right-4 top-4 rounded-lg bg-[#d4af6a] px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#c49a4e] hover:shadow-md active:scale-95"
      >
        🛍️ Add to Cart
      </button>

      {showMessage && (
        <div
          role="status"
          className="fixed right-6 top-24 z-[100] w-[calc(100%-3rem)] max-w-sm rounded-xl border border-[#c49a4e] bg-[#d4af6a] p-5 text-amber-950 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-950 text-lg text-[#d4af6a]">
              ✓
            </span>

            <div>
              <p className="font-bold">Added to Cart!</p>

              <p className="mt-1 text-sm">
                {product.title} has been added successfully.
              </p>

              <p className="mt-2 text-sm font-bold">
                🛍️ {addedCount} {addedCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Close notification"
              className="ml-auto text-lg font-bold transition hover:opacity-60"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}