import Logo from "@/components/Logo";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
