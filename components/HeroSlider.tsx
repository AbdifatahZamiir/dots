"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Slide = {
  images: [string, string]; // left/right on desktop; the first is used on mobile
  eyebrow: string;
  title: string;
  ctas: { label: string; href: string }[];
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [playing, slides.length]);

  return (
    <section className="relative h-[calc(100svh-6.25rem)] min-h-[520px] overflow-hidden bg-mist">
      {slides.map((s, i) => (
        <div
          key={s.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="grid h-full md:grid-cols-2">
            {s.images.map((src, j) => (
              <div key={src} className={`relative h-full ${j === 1 ? "hidden md:block" : ""}`}>
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover object-top transition-transform duration-[7000ms] ease-out ${
                    i === index ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-16 flex flex-col items-center px-5 text-center text-paper">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em]">{s.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-light uppercase tracking-[0.12em] sm:text-6xl">
              {s.title}
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {s.ctas.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  tabIndex={i === index ? 0 : -1}
                  className="min-w-40 bg-paper px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-paper"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-0.5 transition-all ${i === index ? "w-10 bg-paper" : "w-5 bg-paper/50"}`}
            />
          ))}
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="ml-2 text-[10px] uppercase tracking-[0.2em] text-paper/80 hover:text-paper"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </section>
  );
}
