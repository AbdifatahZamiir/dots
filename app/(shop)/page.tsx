import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Logo from "@/components/Logo";
import Lookbook from "@/components/Lookbook";
import HeroBackground from "@/components/HeroBackground";

export const revalidate = 60; // pick up CMS changes within a minute

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night text-cream">
        <HeroBackground />

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <h1 className="anim" style={{ animation: "rise 1.2s cubic-bezier(.2,.7,.2,1) both" }}>
            <Logo size="text-6xl sm:text-8xl md:text-9xl" tagline ripple />
          </h1>
          <p
            className="anim mt-14 text-[11px] uppercase tracking-[0.5em] text-cream/60"
            style={{ animation: "rise 1.2s cubic-bezier(.2,.7,.2,1) .35s both" }}
          >
            Wear your story
          </p>
          <Link
            href="#shop"
            className="anim group mt-10 inline-flex items-center gap-3 border border-cream/40 bg-night/40 px-9 py-4 text-[11px] uppercase tracking-[0.35em] backdrop-blur-sm transition hover:bg-cream hover:text-ink"
            style={{ animation: "rise 1.2s cubic-bezier(.2,.7,.2,1) .6s both" }}
          >
            <span className="size-1.5 rounded-full bg-current transition group-hover:scale-150" />
            Shop the collection
          </Link>
        </div>

        {/* Editorial corner details */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl items-end justify-center px-5 pb-8 sm:justify-between text-[10px] uppercase tracking-[0.35em] text-cream/40">
          <span className="hidden sm:block">Collection 01</span>
          <span className="flex flex-col items-center gap-3 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-cream/10">
              <span
                className="anim absolute inset-0 bg-cream/60"
                style={{ animation: "scroll-cue 2.4s cubic-bezier(.6,0,.3,1) infinite" }}
              />
            </span>
          </span>
          <span className="hidden sm:block">Simple · Modern · Timeless</span>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <div className="mb-10 flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-muted">New arrivals</p>
            <h2 className="text-2xl font-light uppercase tracking-[0.3em]">Shop</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{products.length} pieces</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* Lookbook banner */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-charcoal">
        <Image
          src="/products/crew-group.jpg"
          alt="DOTS crewneck knits in grey, navy and black"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5 text-cream">
          <p className="text-3xl font-light uppercase leading-snug tracking-[0.3em] sm:text-4xl">
            Simple pieces.
            <br />
            Bigger dreams.
          </p>
          <Link
            href="/product/crewneck-knit"
            className="mt-8 self-start border-b border-cream/60 pb-1 text-[11px] uppercase tracking-[0.35em] hover:border-cream"
          >
            Shop the crewneck
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 text-center sm:grid-cols-3">
          {[
            ["Quality in every detail", "Carefully chosen fabrics and finishing you can feel."],
            ["Made for better days", "Pieces built to be worn and loved for years."],
            ["Simple, modern, timeless", "Clean shapes that work with everything you own."],
          ].map(([title, text]) => (
            <div key={title} className="flex flex-col items-center">
              <span className="mb-5 size-3 rounded-full bg-ink" />
              <h3 className="text-xs font-medium uppercase tracking-[0.3em]">{title}</h3>
              <p className="mt-3 max-w-xs text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Lookbook />

      {/* About */}
      <section id="about" className="scroll-mt-16 bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/products/halfzip-brown-1.jpg"
              alt="DOTS half-zip knit with pleated trousers"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-cream/60">About</p>
            <Logo size="text-5xl" tagline align="start" />
            <h2 className="mt-12 text-2xl font-light uppercase tracking-[0.2em]">
              It starts with a dot.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-cream/70">
              A dot is the smallest mark you can make, and it&apos;s where everything begins. We
              design clothes the same way: start simple, take out what you don&apos;t need, and
              put care into the little things.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Our clothes are premium essentials built to last, with quiet details and relaxed cuts.
              We want them to be the pieces you reach for every day.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
