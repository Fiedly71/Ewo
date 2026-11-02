"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductSnapshot } from "@/lib/product-utils";

const STORAGE_KEY = "ewo-recent";

/** Enregistre le produit consulté et affiche les autres produits vus récemment. */
export function RecentlyViewed({ current }: { current: ProductSnapshot }) {
  const [items, setItems] = useState<ProductSnapshot[]>([]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const list = Array.isArray(saved) ? (saved as ProductSnapshot[]) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture de l'historique local
      setItems(list.filter((i) => i.id !== current.id).slice(0, 4));
      localStorage.setItem(STORAGE_KEY, JSON.stringify([current, ...list.filter((i) => i.id !== current.id)].slice(0, 12)));
    } catch {}
  }, [current]);

  if (items.length === 0) return null;
  return (
    <section className="page mt-20">
      <h2 className="text-2xl font-bold tracking-tight">Vus récemment</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {items.map((p) => (
          <Link key={p.id} href={`/produits/${p.id}`} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
              {p.image && <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />}
            </div>
            <p className="mt-3 text-sm font-medium">{p.title}</p>
            <p className="text-sm text-muted">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
