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
    <div className="min-h-screen bg-[#faf7f2] text-[#4a2c11]">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#4a2c11] sm:text-4xl">
            Shopping Cart
          </h1>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="rounded-full border border-[#d4af37]/50 bg-white px-5 py-2.5 text-sm font-semibold text-[#8b5a2b] transition hover:bg-[#4a2c11] hover:text-white"
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {showClearMessage && cart.length === 0 && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-[#d4af37]/30 bg-white p-4 text-center text-sm font-medium text-[#8b5a2b]"
          >
            Your cart has been cleared successfully.
          </div>
        )}

        {cart.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#d4af37]/20 bg-white p-8 py-16 text-center shadow-sm">
            <div className="mb-4 text-5xl">🛍️</div>

            <h2 className="text-xl font-bold text-[#4a2c11]">
              Your cart is empty
            </h2>

            <p className="mt-2 text-stone-600">
              Looks like you haven't added anything yet.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-[#4a2c11] px-6 py-3 font-medium text-[#fdfbf7] transition hover:bg-[#38200b]"
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
                  className="flex items-center gap-4 rounded-xl border border-[#d4af37]/20 bg-white p-4 shadow-sm"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#faf7f2] p-2">
                    <img
                      src={item.images?.[0] || "/placeholder.webp"}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[#4a2c11]">
                      {item.title}
                    </h3>

                    <p className="text-sm font-bold text-[#8b5a2b]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fdfbf7] p-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#faf7f2] font-bold text-[#4a2c11] transition hover:bg-[#4a2c11] hover:text-white"
                    >
                      −
                    </button>

                    <span className="min-w-[1.25rem] text-center text-sm font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#faf7f2] font-bold text-[#4a2c11] transition hover:bg-[#4a2c11] hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.title} from cart`}
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-medium text-red-600 transition hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-[#d4af37]/30 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-[#4a2c11]">
                Order Summary
              </h2>

              <div className="mt-4 flex justify-between border-t border-[#d4af37]/20 pt-4 text-lg font-semibold">
                <span>Total</span>

                <span className="text-[#8b5a2b]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-[#4a2c11] py-3 text-center font-semibold text-[#fdfbf7] shadow-md transition hover:bg-[#38200b]"
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