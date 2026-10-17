import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center bg-[#faf7f2] px-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#eadfce] border-t-[#a78655]" />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f2]">
            <Image
              src="/logo.webp"
              alt="Shop Selina logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 object-contain"
            />
          </div>
        </div>

        <h2 className="mt-5 font-serif text-2xl font-semibold text-[#402b20]">
          Shop Selina
        </h2>

        <p className="mt-2 text-sm text-[#8b796c]">
          Just a moment, preparing something lovely...
        </p>

        <div className="mt-5 h-px w-24 bg-[#d4af6a]" />
      </div>
    </div>
  );
}