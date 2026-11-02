"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CartItem } from "@/lib/types";
import { useCart } from "./cart-provider";

export const KEEP_CART_KEY = "ewo-keep-cart";

/** Lance le paiement Stripe (ou la commande simulée en mode démo). */
export function useCheckout() {
  const router = useRouter();
  const { closeDrawer } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout(items: CartItem[], options?: { clearCart?: boolean }) {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    // « Acheter maintenant » ne doit pas vider le panier existant sur la page de remerciement.
    try {
      if (options?.clearCart === false) sessionStorage.setItem(KEEP_CART_KEY, "1");
      else sessionStorage.removeItem(KEEP_CART_KEY);
    } catch {}
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; demo?: boolean; url?: string };
      if (!res.ok) throw new Error(data.error);
      if (data.demo) {
        closeDrawer();
        router.push("/commande/merci?demo=1");
        setLoading(false);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error();
      }
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Le paiement n'a pas pu démarrer, réessayez.");
      setLoading(false);
    }
  }

  return { checkout, loading, error };
}
