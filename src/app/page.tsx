import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      

      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:py-24">
        
        <p className="text-sm uppercase tracking-widest text-amber-950">
          Welcome to
        </p>
        <h1 className="mb-2 text-4xl font-bold uppercase tracking-widest text-amber-950 sm:text-6xl">
          Shop Selina
        </h1>
        <div className="my-2 h-px w-16 bg-amber-700" />
        <p className="mt-2 text-lg tracking-wide text-amber-800 sm:text-2xl">
          Discover more. Shop smarter.
        </p>

        <p className="mt-2 max-w-xl text-sm leading-7 text-stone-700 sm:text-base">
          Discover a world of everyday essentials, electronics, and more.
          Find the things you love, explore something new, and make every
          shopping experience a little more special. Everything you need,
          all in one place.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-amber-950 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-amber-900"
          >
            Explore Products →
          </Link>

          <Link
            href="/categories"
            className="rounded-full border border-amber-950 px-6 py-3 font-medium text-amber-950 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-950 hover:text-white"
          >
            Browse Categories →
          </Link>
        </div>
        
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-amber-900/60">
          Your everyday favorites, all in one place
        </p>
      </main>
    </div>
  );
}
