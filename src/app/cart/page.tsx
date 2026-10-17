"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [showClearMessage, setShowClearMessage] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleClearCart() {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (!confirmed) return;

    clearCart();
    setShowClearMessage(true);
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#402b20] dark:text-[#faf7f2] sm:text-4xl">
            Shopping Cart
          </h1>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="rounded-full border border-[#d4af37]/50 bg-white px-5 py-2.5 text-sm font-semibold text-[#8b5a2b] transition hover:bg-[#402b20] hover:text-white dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#c6a16b] dark:hover:bg-[#49372b] dark:hover:text-[#faf7f2]"
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {showClearMessage && cart.length === 0 && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-[#d4af37]/30 bg-white p-4 text-center text-sm font-medium text-[#8b5a2b] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#c6a16b]"
          >
            Your cart has been cleared successfully.
          </div>
        )}

        {cart.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#d4af37]/20 bg-white p-8 py-16 text-center shadow-sm dark:border-[#49372b] dark:bg-[#30231d]">
            <div className="mb-4 text-5xl">🛍️</div>

            <h2 className="text-xl font-bold text-[#402b20] dark:text-[#faf7f2]">
              Your cart is empty
            </h2>

            <p className="mt-2 text-stone-600 dark:text-[#c4b4a7]">
              Looks like you haven't added anything yet.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-[#402b20] px-6 py-3 font-medium text-[#faf7f2] transition hover:bg-[#593d2e] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-[#d4af37]/20 bg-white p-4 shadow-sm dark:border-[#49372b] dark:bg-[#30231d]"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#faf7f2] p-2 dark:bg-[#281d18]">
                    <img
                      src={item.images?.[0] || "/placeholder.webp"}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[#402b20] dark:text-[#faf7f2]">
                      {item.title}
                    </h3>

                    <p className="text-sm font-bold text-[#8b5a2b] dark:text-[#c6a16b]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fdfbf7] p-1 dark:border-[#49372b] dark:bg-[#281d18]">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#faf7f2] font-bold text-[#402b20] transition hover:bg-[#402b20] hover:text-white dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:hover:bg-[#49372b]"
                    >
                      −
                    </button>

                    <span className="min-w-[1.25rem] text-center text-sm font-bold text-[#402b20] dark:text-[#faf7f2]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#faf7f2] font-bold text-[#402b20] transition hover:bg-[#402b20] hover:text-white dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:hover:bg-[#49372b]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.title} from cart`}
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-red-600 transition hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-[#d4af37]/30 bg-white p-6 shadow-md dark:border-[#49372b] dark:bg-[#30231d]">
              <h2 className="text-xl font-bold text-[#402b20] dark:text-[#faf7f2]">
                Order Summary
              </h2>

              <div className="mt-4 flex justify-between border-t border-[#d4af37]/20 pt-4 text-lg font-semibold dark:border-[#49372b]">
                <span className="text-[#402b20] dark:text-[#faf7f2]">Total</span>

                <span className="text-[#8b5a2b] dark:text-[#c6a16b]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-[#402b20] py-3 text-center font-semibold text-[#faf7f2] shadow-md transition hover:bg-[#593d2e] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}