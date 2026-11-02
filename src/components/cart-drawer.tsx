"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";
import { CartLine } from "./cart-line";
import { CloseIcon, ShieldIcon } from "./icons";
import { useCheckout } from "./use-checkout";

export function CartDrawer() {
  const { items, count, subtotal, drawerOpen, closeDrawer } = useCart();
  const { checkout, loading, error } = useCheckout();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Ferme le panier quand on change de page.
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className={`fixed inset-0 z-50 ${drawerOpen ? "visible" : "pointer-events-none invisible transition-[visibility] delay-300"}`} aria-hidden={!drawerOpen}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fermer le panier"
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-2xl outline-none transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <p className="text-lg font-semibold">
            Panier <span className="text-muted">({count})</span>
          </p>
          <button type="button" onClick={closeDrawer} tabIndex={drawerOpen ? 0 : -1} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-lg font-semibold">Votre panier est vide</p>
            <p className="text-sm text-muted">Trouvez votre prochaine pièce préférée ou créez la vôtre.</p>
            <Link href="/collections/tous" tabIndex={drawerOpen ? 0 : -1} className="btn btn-primary mt-2 w-full max-w-xs">
              Découvrir la boutique
            </Link>
            <Link href="/personnaliser" tabIndex={drawerOpen ? 0 : -1} className="btn btn-outline w-full max-w-xs">
              Créer mon vêtement
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <CartLine key={item.key} item={item} compact onNavigate={closeDrawer} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-line p-5">
              <div className="flex justify-between text-base font-semibold">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">
                Taxes incluses. Livraison vers l&apos;adresse Ewo prédéfinie. Codes promo acceptés au paiement.
              </p>
              <button type="button" onClick={() => checkout(items)} disabled={loading} className="btn btn-primary w-full">
                {loading ? "Redirection vers le paiement…" : "Passer au paiement"}
              </button>
              {error && <p className="text-sm text-danger" role="alert">{error}</p>}
              <Link href="/panier" className="block text-center text-sm underline underline-offset-4">
                Voir le panier
              </Link>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldIcon className="h-4 w-4" /> Paiement sécurisé par Stripe
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
