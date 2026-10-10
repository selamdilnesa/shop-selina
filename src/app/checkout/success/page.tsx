"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


type OrderItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderItem[];
  total: number;
  createdAt: string;
};

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedOrder = sessionStorage.getItem("shop-selina-last-order");

      if (savedOrder) {
        const parsedOrder: unknown = JSON.parse(savedOrder);

        if (
          typeof parsedOrder === "object" &&
          parsedOrder !== null &&
          "orderNumber" in parsedOrder &&
          "customer" in parsedOrder &&
          "items" in parsedOrder &&
          "total" in parsedOrder &&
          typeof parsedOrder.orderNumber === "string" &&
          Array.isArray(parsedOrder.items) &&
          typeof parsedOrder.total === "number"
        ) {
          setOrder(parsedOrder as Order);
        }
      }
    } catch {
      setOrder(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-[#8b796c]">Loading order summary...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#e8dfd2] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-3xl font-semibold text-[#402b20]">
            No Recent Order
          </h1>

          <p className="mt-4 leading-7 text-[#8b796c]">
            There is no recent simulated order to display. You can browse our
            collection and try checkout.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-full bg-[#402b20] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5a3b2d]"
          >
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-3xl border border-[#e8dfd2] bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5eddf] text-3xl text-[#a78655]">
            ✓
          </div>
          
    <Link href="/" className="mb-8 flex justify-center">
     <Image
    src="/logo.webp"
    alt="Shop Selina Logo"
    width={180}
    height={80}
    priority
    className="h-auto w-36 object-contain"
     />
    </Link>



          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655]">
            Shop Selina
          </p>
          

          <h1 className="mt-3 text-center font-serif text-2xl font-semibold text-[#402b20] sm:text-4xl">
            Thank You for shopping with shop selina!
          </h1>

          <p className="mt-4 text-center leading-7 text-[#8b796c]">
            Your order has been placed successfully! Thank you for choosing Shop Selina. We hope you love your picks as much as we loved bringing them to you. 

          </p>

          <div className="mt-8 rounded-2xl bg-[#faf7f2] p-5">
            <p className="text-sm text-[#8b796c]">Order Reference</p>

            <p className="mt-1 text-lg font-bold text-[#402b20]">
              {order.orderNumber}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-[#402b20]">
              Customer Details
            </h2>

            <div className="mt-4 space-y-2 text-sm text-[#76533c]">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {order.customer.fullName}
              </p>

              <p>
                <span className="font-semibold">Email:</span>{" "}
                {order.customer.email}
              </p>

              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {order.customer.phone}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {order.customer.address}
              </p>

              <p>
                <span className="font-semibold">City:</span>{" "}
                {order.customer.city}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e8dfd2] pt-6">
            <h2 className="font-serif text-xl font-semibold text-[#402b20]">
              Order Summary
            </h2>

            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#402b20]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[#8b796c]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-semibold text-[#76533c]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#e8dfd2] pt-5">
              <span className="font-semibold text-[#402b20]">
                Total Price
              </span>

              <span className="text-xl font-bold text-[#76533c]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[#e8dfd2] p-4">
            <p className="text-xs leading-6 text-[#8b796c]">
              Demo checkout only , no real payment or shipping.

            </p>
          </div>

          <Link
            href="/products"
            className="mt-8 flex w-full items-center justify-center rounded-full bg-[#402b20] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a3b2d]"
          >
            Continue Shopping
          </Link>
        </section>
      </div>
    </main>
  );
}
