"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "./icons";
import { useWishlist } from "./wishlist-provider";

export function WishlistView() {
  const { items, remove } = useWishlist();
  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-line px-6 py-16 text-center">
        <p className="text-xl font-semibold">Aucun favori pour l&apos;instant</p>
        <p className="mt-2 text-muted">Touchez le cœur sur un produit pour le retrouver ici.</p>
        <Link href="/collections/tous" className="btn btn-primary mt-6">Découvrir la boutique</Link>
      </div>
    );
  }
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {items.map((p) => (
        <div key={p.id} className="group relative">
          <Link href={`/produits/${p.id}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
              {p.image && <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />}
            </div>
            <p className="mt-3 text-sm font-medium">{p.title}</p>
            <p className="text-sm text-muted">{formatPrice(p.price)}</p>
          </Link>
          <button type="button" onClick={() => remove(p.id)} aria-label={`Retirer ${p.title} des favoris`} className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-bg/90 shadow-sm">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
