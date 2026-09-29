"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function GalleryTabs({ collections }: { collections: { name: string; items: Product[] }[] }) {
  const tabs = ["Tout", ...collections.map((c) => c.name)];
  const [active, setActive] = useState("Tout");
  const items =
    active === "Tout" ? collections.flatMap((c) => c.items) : (collections.find((c) => c.name === active)?.items ?? []);
  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={active === t}
            onClick={() => setActive(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              active === t ? "bg-accent text-accent-fg" : "border border-line text-muted hover:text-fg"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
