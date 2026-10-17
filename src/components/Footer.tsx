import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d4af6a] bg-[#faf7f2] text-[#402b20] transition-colors dark:border-[#49372b] dark:bg-[#1c1613] dark:text-[#faf7f2]">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.15em] sm:text-xl"
            >
              SHOP SELINA<span className="text-[#a78655] dark:text-[#c6a16b]">.</span>
            </Link>

            <p className="mt-2 max-w-xs text-xs leading-5 opacity-75 sm:mt-3 sm:text-sm sm:leading-6">
              Timeless pieces, everyday essentials, and effortless style.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] sm:mb-4">
              Explore
            </h3>

            <ul className="space-y-1.5 text-xs sm:space-y-3 sm:text-sm">
              <li>
                <Link href="/" className="transition hover:text-[#a78655] dark:hover:text-[#c6a16b]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-[#a78655] dark:hover:text-[#c6a16b]"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="transition hover:text-[#a78655] dark:hover:text-[#c6a16b]"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="transition hover:text-[#a78655] dark:hover:text-[#c6a16b]"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand message */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] sm:mb-4">
              Our Philosophy
            </h3>

            <p className="text-xs leading-5 opacity-75 sm:text-sm sm:leading-6">
              Style that feels like you. Pieces chosen to make everyday
              moments feel special.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-[#eadfce] pt-4 dark:border-[#49372b] sm:mt-8 sm:pt-5">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-xs opacity-70 sm:flex-row sm:gap-3">
            <p>
              © {new Date().getFullYear()} Shop Selina. All rights reserved.
            </p>

            <p>
              Made with care <span className="text-[#a78655] dark:text-[#c6a16b]">♡</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}