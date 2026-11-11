"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import Price, { discountPercent } from "./Price";

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const variant = product.colors[colorIdx];
  const main = variant.images[0];
  const hover = variant.images[1] ?? product.colors[(colorIdx + 1) % product.colors.length]?.images[0];
  const off = discountPercent(product.price, product.compareAt);
  const href = `/product/${product.id}`;

  function quickAdd(size: string) {
    add({
      id: product.id,
      color: variant.name,
      size,
      name: product.name,
      price: product.price,
      image: main,
    });
  }

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-mist">
        <Link href={href} aria-label={product.name}>
          <Image
            src={main}
            alt={`${product.name} in ${variant.name}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover object-top transition duration-700 ${
              hover && hover !== main ? "group-hover:opacity-0" : ""
            }`}
          />
          {hover && hover !== main && (
            <Image
              src={hover}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover object-top opacity-0 transition duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        {off > 0 && (
          <span className="absolute left-0 top-3 bg-sale px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper">
            -{off}%
          </span>
        )}

        {/* Quick add (desktop hover) */}
        <div className="absolute inset-x-2 bottom-2 hidden translate-y-2 bg-paper/95 p-3 opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.2em]">
            Quick add
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => quickAdd(s)}
                className="h-8 min-w-9 border border-line px-2 text-[11px] transition hover:border-ink hover:bg-ink hover:text-paper"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <Link href={href} className="block text-[12px] font-medium uppercase tracking-[0.08em] hover:opacity-60">
          {product.name}
        </Link>
        <Price price={product.price} compareAt={product.compareAt} className="text-[12px]" />
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                title={c.name}
                aria-label={c.name}
                className={`size-3.5 rounded-full ring-offset-2 transition ${
                  i === colorIdx ? "ring-1 ring-ink" : "ring-1 ring-ink/15"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
