"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import Price, { discountPercent } from "./Price";
import type { Product } from "@/lib/types";

export default function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [added, setAdded] = useState(false);

  const variant = product.colors[colorIdx];
  const images = variant.images;

  function pickColor(i: number) {
    setColorIdx(i);
    setImageIdx(0);
  }

  function addToCart() {
    if (!size) return;
    add({
      id: product.id,
      color: variant.name,
      size,
      name: product.name,
      price: product.price,
      image: variant.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {images.length > 1 && (
          <div className="flex gap-3 sm:flex-col">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImageIdx(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-mist transition ${
                  i === imageIdx ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="72px" className="object-cover object-top" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-mist">
          <Image
            key={images[imageIdx]}
            src={images[imageIdx]}
            alt={`${product.name} in ${variant.name}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="animate-[fade_.4s_ease] object-cover object-top"
          />
        </div>
      </div>

      {/* Info */}
      <div className="md:sticky md:top-28 md:self-start">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted">{product.category}</p>
        <h1 className="text-2xl font-normal uppercase tracking-[0.12em] sm:text-3xl">
          {product.name}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <Price price={product.price} compareAt={product.compareAt} className="text-lg" />
          {product.compareAt && (
            <span className="bg-sale px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper">
              -{discountPercent(product.price, product.compareAt)}%
            </span>
          )}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

        {/* Color */}
        <div className="mt-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em]">
            Color <span className="text-muted">— {variant.name}</span>
          </p>
          <div className="flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => pickColor(i)}
                aria-label={c.name}
                title={c.name}
                className={`size-8 rounded-full ring-offset-2 ring-offset-paper transition ${
                  i === colorIdx ? "ring-1 ring-ink" : "ring-1 ring-ink/15 hover:ring-ink/50"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em]">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-11 min-w-12 border px-4 text-sm transition ${
                  size === s ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={addToCart}
          disabled={!size}
          className="mt-10 w-full bg-ink py-4 text-xs font-medium uppercase tracking-[0.3em] text-cream transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added ✓" : size ? "Add to cart" : "Select a size"}
        </button>

        <div className="mt-10 border-t border-line pt-6">
          <p className="mb-4 text-xs uppercase tracking-[0.2em]">Details</p>
          <ul className="space-y-2 text-sm text-muted">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-3">
                <span className="size-1.5 shrink-0 rounded-full bg-ink" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-xs text-muted">
          <p>
            <span className="block uppercase tracking-[0.2em] text-ink">Shipping</span>
            Free over $100
          </p>
          <p>
            <span className="block uppercase tracking-[0.2em] text-ink">Returns</span>
            Free within 30 days
          </p>
        </div>
      </div>
    </div>
  );
}
