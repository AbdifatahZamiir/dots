import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";
import RecentlyViewed from "@/components/RecentlyViewed";

export const revalidate = 60; // pick up CMS changes within a minute

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  return {
    title: product ? `${product.name} — DOTS` : "DOTS",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  const all = await getProducts();
  // Same category first, then everything else.
  const others = all.filter((p) => p.id !== product.id);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-ink"
          >
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
        <ProductView product={product} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6">
        <h2 className="mb-6 text-base font-medium uppercase tracking-[0.2em] sm:text-lg">
          You may also like
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <RecentlyViewed currentId={product.id} products={all} />
      <div className="pb-16" />
    </>
  );
}
