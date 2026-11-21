"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Empties the cart once a payment has been confirmed.
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => clear(), []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
