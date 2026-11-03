"use client";

import { useEffect, useRef } from "react";
import { useCart } from "./cart-provider";
import { KEEP_CART_KEY } from "./use-checkout";

/** Vide le panier après un paiement, sauf après un « Acheter maintenant ». */
export function ClearCart() {
  const { clear } = useCart();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    try {
      if (sessionStorage.getItem(KEEP_CART_KEY)) {
        sessionStorage.removeItem(KEEP_CART_KEY);
        return;
      }
    } catch {}
    clear();
  }, [clear]);
  return null;
}
