import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = { title: "Checkout — DOTS" };

const notices = {
  failed: "Your payment didn't go through. Nothing was charged — please try again.",
  cancelled: "Payment was cancelled. Your cart is still here when you're ready.",
  pending:
    "Your payment is waiting for approval. Approve it on your phone, then press “Check payment”.",
} as const;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; order?: string; sid?: string }>;
}) {
  const { status, order, sid } = await searchParams;
  const notice = status && status in notices ? notices[status as keyof typeof notices] : undefined;
  const recheck =
    status === "pending" && order && sid
      ? `/api/sifalo/return?order_id=${encodeURIComponent(order)}&sid=${encodeURIComponent(sid)}`
      : undefined;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Checkout</span>
      </nav>
      <h1 className="mb-8 text-2xl font-normal uppercase tracking-[0.12em]">Checkout</h1>

      {notice && (
        <div
          className={`mb-8 flex flex-wrap items-center gap-4 border px-5 py-4 text-sm ${
            status === "failed" ? "border-sale/40 bg-sale/5 text-sale" : "border-line bg-mist"
          }`}
        >
          <p className="flex-1">{notice}</p>
          {recheck && (
            <a
              href={recheck}
              className="bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-charcoal"
            >
              Check payment
            </a>
          )}
        </div>
      )}

      <CheckoutForm />
    </section>
  );
}
