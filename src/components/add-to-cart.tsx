"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const firstAvailable = product.variants.find((v) => v.available) ?? product.variants[0];
  const [selected, setSelected] = useState<number[]>(firstAvailable?.optionIds ?? []);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => selected.every((id) => v.optionIds.includes(id))),
    [product.variants, selected],
  );
  const image =
    product.images.find((i) => variant && i.variantIds.includes(variant.id)) ??
    product.images.find((i) => i.isDefault) ??
    product.images[0];

  function choose(optionIndex: number, valueId: number) {
    setAdded(false);
    setSelected((prev) => prev.map((id, i) => (i === optionIndex ? valueId : id)));
  }

  function handleAdd() {
    if (!variant) return;
    add({
      kind: "collection",
      key: `c:${product.id}:${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title,
      image: image?.src ?? "",
      price: variant.price,
      quantity: 1,
    });
    setAdded(true);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        {image && <Image src={image.src} alt={product.title} fill priority sizes="50vw" className="object-cover" />}
      </div>
      <div>
        <h1 className="text-3xl font-black">{product.title}</h1>
        {variant && <p className="mt-2 text-xl">{formatPrice(variant.price)}</p>}

        {product.options.map((option, oi) => (
          <fieldset key={option.name} className="mt-6">
            <legend className="mb-2 text-sm font-semibold">{option.name}</legend>
            <div className="flex flex-wrap gap-2">
              {option.values
                .filter((v) => product.variants.some((pv) => pv.optionIds.includes(v.id)))
                .map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => choose(oi, v.id)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selected[oi] === v.id ? "border-accent bg-accent text-accent-fg" : "border-line hover:border-accent"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
            </div>
          </fieldset>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!variant || !variant.available}
          className="mt-8 w-full rounded-full bg-accent py-4 font-semibold text-accent-fg disabled:opacity-40"
        >
          {!variant || !variant.available ? "Indisponible" : added ? "Ajouté au panier ✓" : "Ajouter au panier"}
        </button>

        <div
          className="prose mt-8 text-sm text-muted"
          // La description vient de la boutique Printify du propriétaire du site.
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
