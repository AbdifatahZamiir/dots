"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = { id: string; color: string; size: string; qty: number };

type CartContext = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  update: (item: Omit<CartItem, "qty">, qty: number) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<CartContext | null>(null);
const KEY = "dots-cart-v2";

const same = (a: Omit<CartItem, "qty">, b: Omit<CartItem, "qty">) =>
  a.id === b.id && a.color === b.color && a.size === b.size;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add: CartContext["add"] = (item) => {
    setItems((prev) => {
      const found = prev.find((i) => same(i, item));
      if (found) return prev.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const update: CartContext["update"] = (item, qty) =>
    setItems((prev) =>
      prev.map((i) => (same(i, item) ? { ...i, qty } : i)).filter((i) => i.qty > 0)
    );

  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, update, clear, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
