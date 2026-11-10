"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import Logo from "./Logo";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-30 bg-night text-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="DOTS home">
          <Logo size="text-xl" />
        </Link>
        <nav className="flex items-center gap-7 text-xs uppercase tracking-[0.25em]">
          <Link href="/#shop" className="hidden hover:opacity-60 sm:inline">
            Shop
          </Link>
          <Link href="/#lookbook" className="hidden hover:opacity-60 sm:inline">
            Lookbook
          </Link>
          <Link href="/#about" className="hidden hover:opacity-60 sm:inline">
            About
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 border border-cream/30 px-4 py-2 uppercase tracking-[0.2em] transition hover:bg-cream hover:text-ink"
          >
            Cart
            <span className="grid size-5 place-items-center rounded-full bg-cream text-[10px] tracking-normal text-ink">
              {count}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
