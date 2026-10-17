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
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) {
  const { addToCart, cart } = useCart();
  const [showMessage, setShowMessage] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  function handleAddToCart() {
    const validQuantity =
      Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    for (let i = 0; i < validQuantity; i++) {
      addToCart(product);
    }

    setAddedCount(
      cart.reduce((total, item) => total + item.quantity, 0) + validQuantity
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
        className="w-full rounded-lg bg-[#d4af6a] px-4 py-2.5 text-sm font-semibold text-[#402b20] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#c49a4e] hover:shadow-md active:scale-95 dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
      >
        🛍️ Add to Cart
      </button>

      {showMessage && (
        <div
          role="status"
          className="fixed right-6 top-24 z-[100] w-[calc(100%-3rem)] max-w-sm rounded-xl border border-[#c49a4e] bg-[#d4af6a] p-5 text-[#402b20] shadow-2xl transition-colors dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2]"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#402b20] text-lg text-[#d4af6a] dark:bg-[#c6a16b] dark:text-[#1c1613]">
              ✓
            </span>

            <div>
              <p className="font-bold text-[#402b20] dark:text-[#faf7f2]">
                Added to Cart!
              </p>

              <p className="mt-1 text-sm text-[#402b20]/90 dark:text-[#c4b4a7]">
                {product.title} has been added successfully.
              </p>

              <p className="mt-2 text-sm font-bold text-[#402b20] dark:text-[#c6a16b]">
                🛍️ {addedCount} {addedCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Close notification"
              className="ml-auto text-lg font-bold transition hover:opacity-60 text-[#402b20] dark:text-[#faf7f2]"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}