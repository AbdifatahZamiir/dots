import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Logo from "@/components/Logo";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "DOTS — Premium Clothing",
  description: "Premium everyday clothing. Simple design, small details.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <footer className="border-t border-cream/10 bg-ink text-cream">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center">
              <Logo size="text-3xl" tagline />
              <p className="text-[11px] uppercase tracking-[0.4em] text-cream/50">Wear your story</p>
              <p className="text-xs text-cream/40">
                © {new Date().getFullYear()} DOTS. All rights reserved.
              </p>
            </div>
          </footer>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
