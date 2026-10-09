"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Cart", href: "/cart" },
    { name: "Login", href: "/login" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white px-4 py-3 shadow-sm sm:px-8">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Shop Selina logo"
            width={400}
            height={200}
            priority
            className="h-16 w-auto object-contain sm:h-24"
          />

          <span className="text-xl font-bold uppercase tracking-wider text-amber-950 sm:text-3xl lg:text-4xl">
            Shop Selina
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-amber-950 md:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-base font-semibold transition-all duration-200 hover:text-amber-700 ${
                  isActive
                    ? "text-amber-800 underline decoration-2 underline-offset-8"
                    : "text-amber-950"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-amber-950 hover:bg-amber-50 md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-xl border border-amber-100 bg-white p-3 text-amber-950 shadow-xl md:hidden"
        >
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-4 py-2.5 font-semibold transition-colors ${
                  isActive
                    ? "bg-amber-50 text-amber-800"
                    : "text-amber-950 hover:bg-amber-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
