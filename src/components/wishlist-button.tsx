"use client";

import type { ProductSnapshot } from "@/lib/product-utils";
import { HeartIcon } from "./icons";
import { useWishlist } from "./wishlist-provider";

export function WishlistButton({ product, variant = "overlay" }: { product: ProductSnapshot; variant?: "overlay" | "inline" }) {
  const { has, toggle } = useWishlist();
  const active = has(product.id);
  const label = active ? "Retirer des favoris" : "Ajouter aux favoris";
  if (variant === "inline") {
    return (
      <button type="button" onClick={() => toggle(product)} aria-pressed={active} aria-label={label} className="grid min-h-[46px] w-12 shrink-0 place-items-center border border-line-strong hover:border-fg">
        <HeartIcon filled={active} className={`h-5 w-5 ${active ? "text-accent" : ""}`} />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-pressed={active}
      aria-label={label}
      className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg transition hover:border-fg"
    >
      <HeartIcon filled={active} className={`h-[18px] w-[18px] ${active ? "text-accent" : ""}`} />
    </button>
  );
}
