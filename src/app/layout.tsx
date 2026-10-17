
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop Selina | Everyday Luxury",
  description:
    "Discover timeless style and everyday essentials at Shop Selina.",
};

function Footer() {
  return (
   <footer className="mt-auto border-t border-[#d4af6a] bg-[#d4af6a] text-[#402b20]">
      <div className="mx-auto max-w-7xl px-6 ">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-semibold tracking-wide">
              Shop Selina<span className="text-[#a78655]">.</span>
            </h2>

            <p className="mt-1 text-sm opacity-75">
              Find your next favorite at Shop Selina.
            </p>
          </div>

          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Shop Selina. All rights reserved.
          </p>
        </div>

        <div className="mx-auto mt-6 h-px w-16 bg-[#d4af6a]" />
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="m-0 flex min-h-screen flex-col p-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <Navbar />

              <main className="flex flex-1 flex-col">
                {children}
              </main>

              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
