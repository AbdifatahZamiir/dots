"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";

const METHODS = ["EVC Plus", "ZAAD", "Sahal", "eDahab", "Premier Wallet", "Visa", "Mastercard"];

export default function CheckoutForm() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = items.reduce((s, l) => s + l.price * l.qty, 0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const customer = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, color, size, qty }) => ({ id, color, size, qty })),
          customer,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Checkout failed");
    } catch {
      setError("Checkout failed. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center text-muted">
        <span className="mb-6 size-4 rounded-full bg-ink" />
        Your cart is empty.
        <Link
          href="/shop"
          className="mt-8 bg-ink px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-charcoal"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-12 md:grid-cols-[1fr_24rem]">
      {/* Delivery details */}
      <div>
        <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.25em]">Delivery details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Full name" autoComplete="name" required minLength={2} />
          <Field
            name="phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="+252 61 xxx xxxx"
            required
            pattern="\+?[\d\s\-]{7,20}"
          />
          <Field name="email" label="Email (optional)" type="email" autoComplete="email" />
          <Field name="city" label="City" autoComplete="address-level2" required />
          <Field
            name="address"
            label="Address / district"
            autoComplete="street-address"
            required
            className="sm:col-span-2"
          />
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-muted">
              Delivery notes (optional)
            </span>
            <textarea
              name="notes"
              rows={3}
              maxLength={300}
              className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </label>
        </div>

        <h2 className="mb-3 mt-10 text-xs font-medium uppercase tracking-[0.25em]">Payment</h2>
        <div className="border border-line p-5">
          <p className="text-sm">
            Press <strong className="font-semibold">Pay</strong> and you&apos;ll choose how to pay on the
            secure <strong className="font-semibold">Sifalo Pay</strong> page, then come back here.
          </p>
          <p className="mt-1 text-xs text-muted">Accepted:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <span key={m} className="border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <aside className="h-fit bg-mist p-6 md:sticky md:top-28">
        <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.25em]">Your order</h2>
        <ul className="space-y-4">
          {items.map((l) => (
            <li key={l.id + l.color + l.size} className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-paper">
                {l.image && <Image src={l.image} alt="" fill sizes="64px" className="object-cover object-top" />}
                <span className="absolute right-0 top-0 grid size-5 place-items-center bg-ink text-[10px] text-cream">
                  {l.qty}
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em]">{l.name}</p>
                <p className="text-xs text-muted">
                  {l.color} · Size {l.size}
                </p>
              </div>
              <p className="text-sm">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-sale">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-ink py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-charcoal disabled:opacity-50"
        >
          {loading ? "Opening Sifalo Pay…" : `Pay ${formatPrice(total)}`}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted">
          Final prices are confirmed on our server before you pay.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <input
        {...props}
        className="h-11 w-full border border-line px-3 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}
