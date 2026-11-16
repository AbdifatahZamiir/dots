"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type CategoryTile = { name: string; image: string; hoverImage?: string; count: number };

// Edge-to-edge row of tall category tiles. Scrolls sideways (with arrows) when they don't fit.
export default function CategoryStrip({ tiles }: { tiles: CategoryTile[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  function scroll(dir: 1 | -1) {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="group/strip relative mt-2">
      <div
        ref={ref}
        onScroll={update}
        className="cat-row flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tiles.map((t) => (
          <Link
            key={t.name}
            href={`/shop?category=${encodeURIComponent(t.name)}`}
            className="cat-tile group relative aspect-[4/5] w-[72%] shrink-0 snap-start overflow-hidden bg-mist sm:w-[40%] lg:w-0 lg:min-w-[15rem] lg:flex-1"
          >
            <Image
              src={t.image}
              alt={t.name}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 72vw"
              className={`object-cover object-top transition duration-[900ms] ease-out group-hover:scale-[1.06] ${
                t.hoverImage ? "group-hover:opacity-0" : ""
              }`}
            />
            {t.hoverImage && (
              <Image
                src={t.hoverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 72vw"
                className="scale-[1.06] object-cover object-top opacity-0 transition duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
              />
            )}

            {/* Overlay darkens on hover so the label pops */}
            <div className="absolute inset-0 bg-ink/15 transition duration-500 group-hover:bg-ink/25" />

            {/* Spotlight: while the row is hovered, every other tile fades to a soft grey wash */}
            <div className="cat-wash pointer-events-none absolute inset-0 bg-paper/55" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-paper">
              <span className="text-sm font-bold uppercase tracking-[0.08em] drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-2 sm:text-[15px]">
                {t.name}
              </span>
              <span className="mt-2 flex translate-y-2 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Shop now · {t.count}
                <span className="block h-px w-6 bg-paper" />
              </span>
            </div>

            {/* Bottom line that grows on hover */}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-paper transition-all duration-500 group-hover:w-full" />
          </Link>
        ))}
      </div>

      {/* Arrows (only when the strip overflows) */}
      {canPrev && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous categories"
          className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-lg shadow-md transition hover:bg-paper"
        >
          ‹
        </button>
      )}
      {canNext && (
        <button
          onClick={() => scroll(1)}
          aria-label="More categories"
          className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-lg shadow-md transition hover:bg-paper"
        >
          ›
        </button>
      )}
    </section>
  );
}
