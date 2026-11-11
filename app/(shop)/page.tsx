import Image from "next/image";
import Link from "next/link";
import { categoriesOf, getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import Lookbook from "@/components/Lookbook";
import Logo from "@/components/Logo";

export const revalidate = 60; // pick up CMS changes within a minute

const slides: Slide[] = [
  {
    images: ["/lookbook/look-2.jpg", "/lookbook/look-5.jpg"],
    eyebrow: "New season",
    title: "Simple pieces",
    ctas: [
      { label: "Shop new in", href: "/shop" },
      { label: "Lookbook", href: "/#lookbook" },
    ],
  },
  {
    images: ["/products/halfzip-brown-1.jpg", "/products/halfzip-cream-1.jpg"],
    eyebrow: "The knit edit",
    title: "Half-zip season",
    ctas: [{ label: "Shop knitwear", href: "/shop?category=Knitwear" }],
  },
  {
    images: ["/lookbook/look-1.jpg", "/lookbook/look-4.jpg"],
    eyebrow: "DOTS — Premium clothing",
    title: "Wear your story",
    ctas: [{ label: "Shop all", href: "/shop" }],
  },
];

export default async function Home() {
  const products = await getProducts();
  const categories = categoriesOf(products);
  const knitwear = products.filter((p) => p.category === "Knitwear");

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading title="Shop by category" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => {
            const p = products.find((x) => x.category === c)!;
            return (
              <Link
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}`}
                className="group relative aspect-[3/4] overflow-hidden bg-mist"
              >
                <Image
                  src={p.colors[0].images[0]}
                  alt={c}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover object-top transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-5 text-center text-paper">
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">{c}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 opacity-90">
                    Shop now
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* New in */}
      <ProductRow title="New in" href="/shop" products={products.slice(0, 8)} total={products.length} />

      {/* Full-width banner */}
      <section className="relative h-[75vh] min-h-[420px] overflow-hidden bg-charcoal">
        <Image
          src="/products/crew-group.jpg"
          alt="DOTS crewneck knits in grey, navy and black"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-paper">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em]">Knitwear</p>
          <h2 className="mt-3 text-4xl font-light uppercase tracking-[0.12em] sm:text-6xl">
            The crewneck
          </h2>
          <Link
            href="/product/crewneck-knit"
            className="mt-7 min-w-40 bg-paper px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper"
          >
            Shop now
          </Link>
        </div>
      </section>

      {knitwear.length > 0 && (
        <ProductRow
          title="Knitwear"
          href="/shop?category=Knitwear"
          products={knitwear.slice(0, 4)}
          total={knitwear.length}
        />
      )}

      <Lookbook />

      {/* About */}
      <section id="about" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
          <Logo size="text-4xl" tagline />
          <h2 className="mt-12 text-lg font-light uppercase tracking-[0.25em]">It starts with a dot.</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            A dot is the smallest mark you can make, and it&apos;s where everything begins. We design
            clothes the same way: start simple, take out what you don&apos;t need, and put care
            into the little things. Our clothes are premium essentials, built to last.
          </p>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, href, total }: { title: string; href?: string; total?: number }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className="text-base font-medium uppercase tracking-[0.2em] sm:text-lg">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-[11px] font-medium uppercase tracking-[0.15em] underline underline-offset-4 hover:opacity-60"
        >
          View all{total ? ` (${total})` : ""}
        </Link>
      )}
    </div>
  );
}

function ProductRow({
  title,
  href,
  products,
  total,
}: {
  title: string;
  href: string;
  products: Product[];
  total: number;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading title={title} href={href} total={total} />
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
