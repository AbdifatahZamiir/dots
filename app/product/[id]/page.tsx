import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  return {
    title: product ? `${product.name} — DOTS` : "DOTS",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <nav className="mb-8 text-[11px] uppercase tracking-[0.2em] text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
        <ProductView product={product} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-12">
        <h2 className="mb-8 border-b border-line pb-4 text-xs font-medium uppercase tracking-[0.3em]">
          You may also like
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
