import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d4af6a] bg-[#faf7f2] text-[#402b20] dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-semibold tracking-[0.15em]"
            >
              SHOP SELINA<span className="text-[#a78655]">.</span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 opacity-75">
              Timeless pieces, everyday essentials, and effortless style.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
              Explore
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition hover:text-[#a78655]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-[#a78655]"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="transition hover:text-[#a78655]"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="transition hover:text-[#a78655]"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand message */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
              Our Philosophy
            </h3>

            <p className="text-sm leading-6 opacity-75">
              Style that feels like you. Pieces chosen to make everyday
              moments feel special.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-[#eadfce] pt-5 dark:border-border">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs opacity-70 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Shop Selina. All rights reserved.
            </p>

            <p>
              Made with care <span className="text-[#a78655]">♡</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
