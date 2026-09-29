"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";

export function CartView() {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <p className="mt-8 text-muted">
        Votre panier est vide.{" "}
        <Link href="/collections" className="font-semibold text-fg underline">
          Voir les collections
        </Link>
      </p>
    );
  }

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.demo) {
        clear();
        router.push("/commande/merci?demo=1");
      } else {
        window.location.href = data.url;
      }
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Le paiement n'a pas pu démarrer.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.key} className="flex gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- images Printify ou téléversées */}
            <img
              src={item.kind === "custom" ? item.designUrl : item.image}
              alt=""
              className="h-20 w-20 rounded-lg bg-surface object-contain"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.variantTitle}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <label className="sr-only" htmlFor={`q-${item.key}`}>Quantité</label>
                <input
                  id={`q-${item.key}`}
                  type="number"
                  min={1}
                  max={20}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.key, Number(e.target.value) || 1)}
                  className="w-16 rounded border border-line px-2 py-1"
                />
                <button type="button" onClick={() => remove(item.key)} className="text-muted underline">
                  Retirer
                </button>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
        <div className="flex justify-between font-semibold">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-muted">
          Livraison vers l&apos;adresse Ewo prédéfinie. Le prix final est confirmé à l&apos;étape de paiement.
        </p>
        <button
          type="button"
          onClick={checkout}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent py-4 font-semibold text-accent-fg disabled:opacity-40"
        >
          {loading ? "Redirection…" : "Payer"}
        </button>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </aside>
    </div>
  );
}
