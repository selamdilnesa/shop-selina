"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }

    const checkoutCompleted = sessionStorage.getItem("shop-selina-checkout-completed");
    
    if (!checkoutCompleted) {
      router.replace("/");
      return;
    }

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
  }, [authLoading, user, router]);

  const handleContinueShopping = () => {
    sessionStorage.removeItem("shop-selina-checkout-completed");
    sessionStorage.removeItem("shop-selina-last-order");
    router.push("/products");
  };

  if (authLoading || !loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2]">
        <p className="text-[#8b796c] dark:text-[#c4b4a7]">Loading order summary...</p>
      </main>
    );
  }

  if (!user || !order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] px-5 py-12 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-3xl border border-[#e8dfd2] bg-white p-6 shadow-sm transition-colors dark:border-[#49372b] dark:bg-[#30231d] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5eddf] text-3xl text-[#a78655] dark:bg-[#281d18] dark:text-[#c6a16b]">
            ✓
          </div>

          <Link href="/" className="mb-8 flex justify-center">
            <Image
              src="/logo.webp"
              alt="Shop Selina Logo"
              width={180}
              height={80}
              priority
              className="h-auto w-36 object-contain dark:hidden"
            />
            <Image
              src="/darkLogo.jpg"
              alt="Shop Selina Logo"
              width={180}
              height={80}
              priority
              className="hidden h-auto w-36 object-contain dark:block"
            />
          </Link>

          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655] dark:text-[#c6a16b]">
            Shop Selina
          </p>

          <h1 className="mt-3 text-center font-serif text-2xl font-semibold text-[#402b20] dark:text-[#faf7f2] sm:text-4xl">
            Thank You for shopping with shop selina!
          </h1>

          <p className="mt-4 text-center leading-7 text-[#8b796c] dark:text-[#c4b4a7]">
            Your order has been placed successfully! Thank you for choosing Shop Selina. We hope you love your picks as much as we loved bringing them to you.
          </p>

          <div className="mt-8 rounded-2xl bg-[#faf7f2] p-5 transition-colors dark:bg-[#281d18]">
            <p className="text-sm text-[#8b796c] dark:text-[#c4b4a7]">Order Reference</p>

            <p className="mt-1 text-lg font-bold text-[#402b20] dark:text-[#faf7f2]">
              {order.orderNumber}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-[#402b20] dark:text-[#faf7f2]">
              Customer Details
            </h2>

            <div className="mt-4 space-y-2 text-sm text-[#76533c] dark:text-[#c4b4a7]">
              <p>
                <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">Name:</span>{" "}
                {order.customer.fullName}
              </p>

              <p>
                <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">Email:</span>{" "}
                {order.customer.email}
              </p>

              <p>
                <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">Phone:</span>{" "}
                {order.customer.phone}
              </p>

              <p>
                <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">Address:</span>{" "}
                {order.customer.address}
              </p>

              <p>
                <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">City:</span>{" "}
                {order.customer.city}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e8dfd2] pt-6 dark:border-[#49372b]">
            <h2 className="font-serif text-xl font-semibold text-[#402b20] dark:text-[#faf7f2]">
              Order Summary
            </h2>

            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#402b20] dark:text-[#faf7f2]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[#8b796c] dark:text-[#c4b4a7]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-semibold text-[#76533c] dark:text-[#c6a16b]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#e8dfd2] pt-5 dark:border-[#49372b]">
              <span className="font-semibold text-[#402b20] dark:text-[#faf7f2]">
                Total Price
              </span>

              <span className="text-xl font-bold text-[#76533c] dark:text-[#c6a16b]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[#e8dfd2] p-4 transition-colors dark:border-[#49372b] dark:bg-[#281d18]">
            <p className="text-xs leading-6 text-[#8b796c] dark:text-[#c4b4a7]">
              Demo checkout only, no real payment or shipping.
            </p>
          </div>

          <button
            onClick={handleContinueShopping}
            className="mt-8 flex w-full items-center justify-center rounded-full bg-[#402b20] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5a3b2d] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
          >
            Continue Shopping
          </button>
        </section>
      </div>
    </main>
  );
}