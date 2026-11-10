"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice, getProduct, getVariant } from "@/lib/products";

export default function CartDrawer() {
  const { items, open, setOpen, update } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lines = items.flatMap((i) => {
    const product = getProduct(i.id);
    return product ? [{ ...i, product, variant: getVariant(product, i.color) }] : [];
  });
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Checkout failed");
    } catch {
      setError("Checkout failed");
    }
    setLoading(false);
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em]">Your cart</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-xs uppercase tracking-[0.2em] hover:opacity-60"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center text-muted">
              <span className="mb-6 size-4 rounded-full bg-ink" />
              Your cart is empty.
            </div>
          ) : (
            lines.map(({ product, variant, color, size, qty }) => {
              const key = { id: product.id, color, size };
              return (
                <div key={product.id + color + size} className="flex gap-4 border-b border-line py-5">
                  <div className="relative h-28 w-22 shrink-0 overflow-hidden bg-cream">
                    <Image
                      src={variant.images[0]}
                      alt={`${product.name} in ${variant.name}`}
                      fill
                      sizes="88px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2 text-sm">
                      <p className="font-medium">{product.name}</p>
                      <p>{formatPrice(product.price * qty)}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {variant.name} · Size {size}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-sm">
                      <button
                        onClick={() => update(key, qty - 1)}
                        aria-label="Decrease quantity"
                        className="size-7 rounded-full border border-line hover:bg-line"
                      >
                        −
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => update(key, qty + 1)}
                        aria-label="Increase quantity"
                        className="size-7 rounded-full border border-line hover:bg-line"
                      >
                        +
                      </button>
                      <button
                        onClick={() => update(key, 0)}
                        className="ml-auto text-xs text-muted underline hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-6 py-6">
            <div className="mb-1 flex justify-between">
              <span className="text-sm uppercase tracking-[0.2em]">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-5 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-ink py-4 text-xs font-medium uppercase tracking-[0.3em] text-cream transition hover:bg-charcoal disabled:opacity-50"
            >
              {loading ? "Redirecting…" : "Checkout"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
