"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { saveOrder } from "@/lib/orders";

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0 || isSubmitting) {
      return;
    }

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(form);

    const order = {
      orderNumber: `SS-${Date.now().toString().slice(-6)}`,
      customer: {
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        address: String(formData.get("address") || ""),
        city: String(formData.get("city") || ""),
      },
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        images: item.images,
      })),
      total: subtotal,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save the order to the browser's persistent storage.
      saveOrder(order);

      // Keep the latest order for the existing checkout success page.
      sessionStorage.setItem(
        "shop-selina-last-order",
        JSON.stringify(order)
      );

      // Clear the cart after the order is saved.
      cart.forEach((item) => removeFromCart(item.id));

      router.push("/checkout/success");
    } catch {
      setIsSubmitting(false);

      alert(
        "We couldn't save your checkout summary in this browser. Please try again."
      );
    }
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#e8dfd2] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-[#402b20]">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-[#8b796c]">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5a3b2d]"
          >
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
          Shop Selina
        </p>

        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#402b20] sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#8b796c]">
          Enter your details and review your order before submitting.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
        >
          <section className="rounded-2xl border border-[#e8dfd2] bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-[#402b20]">
              Delivery Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-[#402b20]"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  className="w-full rounded-xl border border-[#e8dfd2] bg-[#fdfbf8] px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50] focus:ring-2 focus:ring-[#d4af6a]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#402b20]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[#e8dfd2] bg-[#fdfbf8] px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50] focus:ring-2 focus:ring-[#d4af6a]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-[#402b20]"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-xl border border-[#e8dfd2] bg-[#fdfbf8] px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50] focus:ring-2 focus:ring-[#d4af6a]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-[#402b20]"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Enter your full delivery address"
                  required
                  minLength={5}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-[#e8dfd2] bg-[#fdfbf8] px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50] focus:ring-2 focus:ring-[#d4af6a]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-[#402b20]"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Enter your city"
                  required
                  className="w-full rounded-xl border border-[#e8dfd2] bg-[#fdfbf8] px-4 py-3 text-sm text-[#402b20] outline-none focus:border-[#b18a50] focus:ring-2 focus:ring-[#d4af6a]/20"
                />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-[#e8dfd2] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#402b20]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-5 text-[#402b20]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-[#8b796c]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold text-[#76533c]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#e8dfd2] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b796c]">
                  Total Price
                </span>

                <span className="text-xl font-bold text-[#76533c]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-full bg-[#402b20] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#8b796c]">
              This is a simulated checkout. No real payment or shipping is
              processed.
            </p>

            <Link
              href="/cart"
              className="mt-4 block text-center text-sm font-medium text-[#a78655] transition hover:text-[#402b20]"
            >
              ← Return to Cart
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}
