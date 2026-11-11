"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import Logo from "./Logo";

const icon = "size-5 stroke-current fill-none";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={icon} strokeWidth="1.5" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className={icon} strokeWidth="1.5" aria-hidden>
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className={icon} strokeWidth="1.5" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

const messages = [
  "Free shipping on orders over $100",
  "Free returns within 30 days",
  "New season — simple pieces, made to last",
];

export default function Header({ categories }: { categories: string[] }) {
  const { count, setOpen } = useCart();
  const router = useRouter();
  const [msg, setMsg] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  }

  const nav = [
    { label: "New In", href: "/shop" },
    ...categories.map((c) => ({ label: c, href: `/shop?category=${encodeURIComponent(c)}` })),
    { label: "Lookbook", href: "/#lookbook" },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-cream">
        <p
          key={msg}
          className="anim mx-auto flex h-9 max-w-6xl items-center justify-center px-5 text-[10px] font-medium uppercase tracking-[0.25em]"
          style={{ animation: "fade .6s ease" }}
        >
          {messages[msg]}
        </p>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          {/* Left: menu (mobile) / nav (desktop) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="-ml-2 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.15em] lg:flex">
              {nav.map((n) => (
                <Link key={n.label} href={n.href} className="py-2 hover:opacity-60">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link href="/" aria-label="DOTS home" className="px-4">
            <Logo size="text-[22px]" />
          </Link>

          {/* Right: search + cart */}
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2 hover:opacity-60"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative -mr-2 p-2 hover:opacity-60"
              aria-label={`Cart, ${count} items`}
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-line">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="flex-1 bg-transparent py-1 text-sm uppercase tracking-[0.1em] outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-paper transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Logo size="text-lg" />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-[11px] uppercase tracking-[0.15em]"
            >
              Close
            </button>
          </div>
          <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-line px-5 py-4">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </form>
          <nav className="flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-line px-5 py-4 text-xs font-medium uppercase tracking-[0.2em]"
              >
                {n.label}
                <span aria-hidden>›</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
