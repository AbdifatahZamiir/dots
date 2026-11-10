"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function Success() {
  const { clear } = useCart();
  useEffect(() => clear(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="mb-8 size-6 rounded-full bg-ink" />
      <h1 className="font-display text-4xl">Thank you for your order.</h1>
      <p className="mt-4 text-muted">A confirmation email is on its way.</p>
      <Link
        href="/"
        className="mt-10 bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.3em] text-cream transition hover:bg-charcoal"
      >
        Continue shopping
      </Link>
    </section>
  );
}
