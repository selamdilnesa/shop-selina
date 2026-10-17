"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    Products: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 10v10" />
      </>
    ),
    Categories: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    Cart: (
      <>
        <path d="M3 3h2l2.4 11.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    Login: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    Profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    Account: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    Admin: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 8h8M8 12h3M8 16h5M16 12h.01M16 16h.01" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function ProfileAvatar({
  name,
  size = "normal",
}: {
  name: string;
  size?: "normal" | "small";
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const isSmall = size === "small";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[#d4af6a] bg-[#faf7f2] font-semibold text-[#402b20] ${
        isSmall ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
      }`}
      aria-label={`${name || "User"} profile`}
    >
      {initial}
    </span>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  const themeOptions = [
    { name: "Light", value: "light", icon: "☀️" },
    { name: "Dark", value: "dark", icon: "🌙" },
    { name: "System", value: "system", icon: "💻" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={themeRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setThemeMenuOpen((open) => !open)}
        aria-label="Change appearance"
        aria-expanded={themeMenuOpen}
        aria-haspopup="menu"
        title="Change appearance"
        className="flex h-4 w-3 items-center justify-center rounded-full border border-[#eadfce] bg-[#faf7f2] text-lg transition hover:border-[#d4af6a] hover:bg-[#f0e5d4]"
      >
       {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {themeMenuOpen && (
        <div
          role="menu"
          aria-label="Choose appearance"
          className="absolute right-0 top-full z-[60] mt-2 w-36 rounded-xl border border-[#eadfce] bg-white p-2 text-[#402b20] shadow-xl"
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme(option.value);
                setThemeMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#faf7f2] ${
                theme === option.value
                  ? "bg-[#f0e5d4] font-semibold"
                  : ""
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.name}</span>
              {theme === option.value && (
                <span className="ml-auto text-[#a78655]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { cart } = useCart();
  const { user, loading } = useAuth();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const accountLink = {
    name: loading ? "Account" : user ? "Profile" : "Login",
    href: loading ? "/login" : user ? "/profile" : "/login",
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    accountLink,
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/login") return pathname === "/login";
    if (href === "/profile") return pathname.startsWith("/profile");

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8dfd2] bg-white/95 px-3 py-3 shadow-sm backdrop-blur-md sm:px-8">
      <nav className="flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-1.5 sm:gap-3"
        >
          <Image
            src="/logo.webp"
            alt="Shop Selina logo"
            width={400}
            height={200}
            priority
            className="h-10 w-auto object-contain sm:h-16"
          />

          <span className="whitespace-nowrap text-sm font-bold uppercase tracking-wide text-[#402b20] sm:text-2xl sm:tracking-wider lg:text-3xl">
            Shop Selina
          </span>
        </Link>

        <div className="hidden items-center gap-5 text-[#402b20] md:flex lg:gap-7">
          {links.slice(0, 3).map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors hover:text-[#b18a50] ${
                  active ? "text-[#a78655]" : "text-[#402b20]"
                }`}
              >
                <NavIcon name={link.name} />
                {link.name}

                {active && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d4af6a]" />
                )}
              </Link>
            );
          })}

          <Link
            href="/cart"
            aria-current={isActive("/cart") ? "page" : undefined}
            className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors hover:text-[#b18a50] ${
              isActive("/cart") ? "text-[#a78655]" : "text-[#402b20]"
            }`}
          >
            <NavIcon name="Cart" />
            Cart

            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af6a] px-1 text-[10px] font-bold text-[#402b20]">
                {cartCount}
              </span>
            )}

            {isActive("/cart") && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d4af6a]" />
            )}
          </Link>

          {links.slice(3).map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors hover:text-[#b18a50] ${
                  active ? "text-[#a78655]" : "text-[#402b20]"
                }`}
              >
                {link.name === "Profile" && user ? (
                  <ProfileAvatar name={user.name} />
                ) : (
                  <NavIcon name={link.name} />
                )}

                {link.name}

                {active && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d4af6a]" />
                )}
              </Link>
            );
          })}

          {!loading && user?.role === "admin" && (
            <Link
              href="/admin"
              aria-current={isActive("/admin") ? "page" : undefined}
              className={`relative flex items-center gap-2 py-3 text-sm font-medium transition-colors hover:text-[#b18a50] ${
                isActive("/admin") ? "text-[#a78655]" : "text-[#402b20]"
              }`}
            >
              <NavIcon name="Admin" />
              Admin Dashboard

              {isActive("/admin") && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#d4af6a]" />
              )}
            </Link>
          )}

          <ThemeSwitcher />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
          <ThemeSwitcher />

          <Link
            href="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            aria-current={isActive("/cart") ? "page" : undefined}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#faf7f2] ${
              isActive("/cart") ? "text-[#a78655]" : "text-[#402b20]"
            }`}
          >
            <NavIcon name="Cart" />

            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#d4af6a] px-1 text-[10px] font-bold text-[#402b20]">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#402b20] transition hover:bg-[#faf7f2]"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-3 top-full z-50 mt-2 flex w-64 flex-col gap-1 rounded-xl border border-[#e8dfd2] bg-white p-3 text-[#402b20] shadow-xl md:hidden"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#faf7f2] text-[#a78655]"
                    : "text-[#402b20] hover:bg-[#faf7f2]"
                }`}
              >
                <span className="flex items-center gap-3">
                  {link.name === "Profile" && user ? (
                    <ProfileAvatar name={user.name} size="small" />
                  ) : (
                    <NavIcon name={link.name} />
                  )}

                  {link.name}
                </span>
              </Link>
            );
          })}

          {!loading && user?.role === "admin" && (
            <>
              <div className="my-1 border-t border-[#eadfce]" />

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                aria-current={isActive("/admin") ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive("/admin")
                    ? "bg-[#f0e5d4] text-[#a78655]"
                    : "text-[#402b20] hover:bg-[#faf7f2]"
                }`}
              >
                <NavIcon name="Admin" />
                Admin Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}