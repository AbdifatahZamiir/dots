import Link from "next/link";
import { categoriesOf, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "Shop — DOTS" };

const sorts = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

type Search = { category?: string; sort?: string; q?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { category, sort = "featured", q } = await searchParams;
  const all = await getProducts();
  const categories = categoriesOf(all);

  let products = all;
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    const needle = q.toLowerCase();
    products = products.filter((p) =>
      [p.name, p.category, p.description, ...p.colors.map((c) => c.name)]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);

  const link = (next: Partial<Search>) => {
    const params = new URLSearchParams();
    const merged = { category, sort, q, ...next };
    if (merged.category) params.set("category", merged.category);
    if (merged.sort && merged.sort !== "featured") params.set("sort", merged.sort);
    if (merged.q) params.set("q", merged.q);
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const title = q ? `Results for “${q}”` : category ?? "New in";

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <nav className="mb-6 text-[10px] uppercase tracking-[0.2em] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-light uppercase tracking-[0.15em]">{title}</h1>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-20 -mx-4 mb-8 flex flex-col gap-3 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {[undefined, ...categories].map((c) => (
            <Link
              key={c ?? "all"}
              href={link({ category: c, q: undefined })}
              className={`shrink-0 border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] transition ${
                c === category
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink"
              }`}
            >
              {c ?? "All"}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em]">
          <span className="text-muted">Sort</span>
          {sorts.map((s) => (
            <Link
              key={s.key}
              href={link({ sort: s.key })}
              className={s.key === sort ? "font-semibold underline underline-offset-4" : "hover:opacity-60"}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <span className="mb-6 size-3 rounded-full bg-ink" />
          <p className="text-sm uppercase tracking-[0.15em]">No products found</p>
          <Link href="/shop" className="mt-6 text-[11px] uppercase tracking-[0.15em] underline underline-offset-4">
            View all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
