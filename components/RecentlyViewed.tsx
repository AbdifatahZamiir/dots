"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const KEY = "dots-recent";

// Remembers products this visitor opened (in their browser only) and shows them.
export default function RecentlyViewed({
  currentId,
  products,
}: {
  currentId?: string;
  products: Product[];
}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let list: string[] = [];
    try {
      list = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {}
    setIds(list.filter((id) => id !== currentId));
    if (currentId) {
      const next = [currentId, ...list.filter((id) => id !== currentId)].slice(0, 12);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
    }
  }, [currentId]);

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="mb-6 text-base font-medium uppercase tracking-[0.2em] sm:text-lg">
        Recently viewed
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
