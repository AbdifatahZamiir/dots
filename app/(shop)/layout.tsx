import Link from "next/link";
import Logo from "@/components/Logo";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { categoriesOf, getProducts } from "@/lib/products";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = categoriesOf(await getProducts());

  return (
    <CartProvider>
      <Header categories={categories} />
      <main>{children}</main>

      <footer className="bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size="text-3xl" tagline align="start" />
            <p className="mt-8 max-w-xs text-xs leading-relaxed text-cream/60">
              Simple, modern, timeless essentials. Wear your story.
            </p>
          </div>
          <FooterCol title="Shop">
            <Link href="/shop">New In</Link>
            {categories.map((c) => (
              <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`}>
                {c}
              </Link>
            ))}
          </FooterCol>
          <FooterCol title="Explore">
            <Link href="/#lookbook">Lookbook</Link>
            <Link href="/#about">About DOTS</Link>
          </FooterCol>
          <FooterCol title="Customer care">
            <span>Free shipping over $100</span>
            <span>Free returns within 30 days</span>
            <span>Secure checkout by Stripe</span>
          </FooterCol>
        </div>
        <div className="border-t border-cream/10">
          <p className="mx-auto max-w-7xl px-4 py-6 text-[10px] uppercase tracking-[0.2em] text-cream/40 sm:px-6">
            © {new Date().getFullYear()} DOTS. All rights reserved.
          </p>
        </div>
      </footer>

      <CartDrawer />
    </CartProvider>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em]">{title}</h3>
      <div className="flex flex-col gap-3 text-xs text-cream/60 [&_a:hover]:text-cream">
        {children}
      </div>
    </div>
  );
}
