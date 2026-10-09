"use client";

import { useCart } from "@/context/CartContext";

import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#4a2c11]">
     

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[#4a2c11] sm:text-4xl">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="mt-12 text-center py-16 rounded-2xl border border-[#d4af37]/20 bg-white p-8 shadow-sm">
            <p className="text-lg text-stone-600">Your cart is currently empty.</p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-[#4a2c11] px-6 py-3 font-medium text-[#fdfbf7] transition hover:bg-[#38200b]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
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

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#4a2c11] truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm font-bold text-[#8b5a2b]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fdfbf7] p-1">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf7f2] font-bold text-[#4a2c11] border border-[#d4af37]/30 transition hover:bg-[#4a2c11] hover:text-white"
                    >
                      −
                    </button>
                    <span className="min-w-[1.25rem] text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf7f2] font-bold text-[#4a2c11] border border-[#d4af37]/30 transition hover:bg-[#4a2c11] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#d4af37]/30 bg-white p-6 shadow-md h-fit">
              <h2 className="text-xl font-bold text-[#4a2c11]">Order Summary</h2>
              <div className="mt-4 flex justify-between border-t border-[#d4af37]/20 pt-4 text-lg font-semibold">
                <span>Total</span>
                <span className="text-[#8b5a2b]">${subtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-[#4a2c11] py-3 font-semibold text-[#fdfbf7] shadow-md transition hover:bg-[#38200b]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}