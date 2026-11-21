import Link from "next/link";
import ClearCart from "@/components/ClearCart";

export const metadata = { title: "Thank you — DOTS" };

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <ClearCart />
      <span className="mb-8 size-6 rounded-full bg-ink" />
      <h1 className="font-display text-4xl">Thank you for your order.</h1>
      {order && (
        <p className="mt-4 text-sm uppercase tracking-[0.2em]">
          Order <span className="font-semibold">{order}</span>
        </p>
      )}
      <p className="mt-4 text-muted">Your payment was received. We&apos;ll call you to arrange delivery.</p>
      <Link
        href="/"
        className="mt-10 bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.3em] text-cream transition hover:bg-charcoal"
      >
        Continue shopping
      </Link>
    </section>
  );
}
