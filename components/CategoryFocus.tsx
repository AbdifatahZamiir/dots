import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// "Categories in Focus": a large banner on one side, that category's products on the other.
export default function CategoryFocus({
  category,
  image,
  products,
  reverse = false,
}: {
  category: string;
  image: string;
  products: Product[];
  reverse?: boolean;
}) {
  const href = `/shop?category=${encodeURIComponent(category)}`;
  const shown = products.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className={`grid gap-6 lg:grid-cols-2 lg:gap-10 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[640px]">
          <Image
            src={image}
            alt={category}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top transition duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-paper">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em]">Category in focus</p>
            <p className="mt-2 text-3xl font-light uppercase tracking-[0.1em]">{category}</p>
            <span className="mt-5 inline-block bg-paper px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition group-hover:bg-ink group-hover:text-paper">
              Shop {category}
            </span>
          </div>
        </Link>

        <div className="flex flex-col">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Categories in Focus</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">{category}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {/* View all tile */}
            <Link
              href={href}
              className="group flex aspect-[3/4] flex-col items-center justify-center border border-line bg-mist text-center transition hover:border-ink"
            >
              <span className="mb-4 size-3 rounded-full bg-ink transition group-hover:scale-150" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">View all</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                {products.length} {products.length === 1 ? "product" : "products"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
