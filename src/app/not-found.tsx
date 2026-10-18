import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-5 py-12 text-[#402b20] transition-colors dark:bg-[#1c1613] dark:text-[#faf7f2] sm:px-8">
      <div className="mx-auto max-w-lg text-center rounded-3xl border border-[#eadfce] bg-white p-8 shadow-sm dark:border-[#49372b] dark:bg-[#30231d] sm:p-12">
        
        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.webp"
            alt="Shop Selina Logo"
            width={160}
            height={70}
            priority
            className="h-auto w-32 object-contain dark:hidden"
          />
          <Image
            src="/darkLogo.jpg"
            alt="Shop Selina Logo"
            width={160}
            height={70}
            priority
            className="hidden h-auto w-32 object-contain dark:block"
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a78655] dark:text-[#c6a16b]">
          404 Error · Page Not Found
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold text-[#402b20] dark:text-[#faf7f2] sm:text-4xl">
          Oops! This style went missing.
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#806f63] dark:text-[#c4b4a7]">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back to the boutique.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-[#402b20] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#604333] dark:bg-[#c6a16b] dark:text-[#1c1613] dark:hover:bg-[#d6b27c]"
          >
            Return to Store Home
          </Link>
        </div>

        <div className="mt-8 border-t border-[#eadfce] pt-6 dark:border-[#49372b]">
          <p className="text-xs text-[#806f63] dark:text-[#c4b4a7]">
            Shop Selina · Everyday Luxury
          </p>
        </div>

      </div>
    </main>
  );
}