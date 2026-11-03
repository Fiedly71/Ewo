"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";
import { CartLine } from "./cart-line";
import { ShieldIcon, TruckIcon } from "./icons";
import { useCheckout } from "./use-checkout";

export function CartView() {
  const { items, subtotal, loaded } = useCart();
  const { checkout, loading, error } = useCheckout();

  if (!loaded) return <div className="mt-10 h-40 animate-pulse bg-surface" />;

  if (items.length === 0) {
    return (
      <div className="mt-10 border border-line px-6 py-16 text-center">
        <p className="text-xl font-semibold">Votre panier est vide</p>
        <p className="mt-2 text-muted">Parcourez nos collections ou créez votre propre vêtement.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/collections/tous" className="btn">Découvrir la boutique</Link>
          <Link href="/personnaliser" className="btn btn-outline">Créer mon vêtement</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="hidden justify-between border-b border-line pb-3 text-xs tracking-wider text-muted uppercase md:flex">
          <span>Produit</span>
          <span>Total</span>
        </div>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <CartLine key={item.key} item={item} />
          ))}
        </ul>
        <Link href="/collections/tous" className="mt-6 inline-block text-sm underline underline-offset-4">
          ← Continuer mes achats
        </Link>
      </div>
      <aside className="h-fit space-y-4 bg-surface p-6 lg:sticky lg:top-28">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Livraison</span>
          <span>Adresse Ewo prédéfinie</span>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-lg font-semibold">
          <span>Total estimé</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button type="button" onClick={() => checkout(items)} disabled={loading} className="btn w-full">
          {loading ? "Redirection…" : "Passer au paiement"}
        </button>
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <ul className="space-y-2 pt-2 text-xs text-muted">
          <li className="flex items-center gap-2"><ShieldIcon className="h-4 w-4" /> Paiement sécurisé par Stripe, codes promo acceptés</li>
          <li className="flex items-center gap-2"><TruckIcon className="h-4 w-4" /> Imprimé à la demande puis expédié</li>
        </ul>
      </aside>
    </div>
  );
}
