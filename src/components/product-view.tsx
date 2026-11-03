"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { colorHex } from "@/lib/colors";
import { formatPrice } from "@/lib/format";
import { isColorOption, isSizeOption, toSnapshot, usedValues } from "@/lib/product-utils";
import type { CartItem, Product } from "@/lib/types";
import { useCart } from "./cart-provider";
import { ChatIcon, ShieldIcon, SparkIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";
import { SizeGuide } from "./size-guide";
import { Stars } from "./stars";
import { useCheckout } from "./use-checkout";
import { WishlistButton } from "./wishlist-button";

type Props = {
  product: Product;
  initialVariantId?: number;
  /** Nom de la collection (pour le fil d’Ariane côté page). */
  collection?: string;
  rating?: { average: number; count: number };
  children?: React.ReactNode;
};

/** Fiche produit : galerie synchronisée avec les variantes, options, quantité, ajout au panier et achat immédiat. */
export function ProductView({ product, initialVariantId, rating, children }: Props) {
  const { add } = useCart();
  const { checkout, loading, error } = useCheckout();
  const start =
    product.variants.find((v) => v.id === initialVariantId) ??
    product.variants.find((v) => v.available) ??
    product.variants[0];
  const [selected, setSelected] = useState<number[]>(start?.optionIds ?? []);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(() => {
    const i = product.images.findIndex((img) => start && img.variantIds.includes(start.id));
    return i === -1 ? 0 : i;
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => selected.every((id) => v.optionIds.includes(id))),
    [product.variants, selected],
  );
  const image = product.images[imageIndex] ?? product.images[0];
  const canBuy = Boolean(variant?.available);

  // Garde la variante dans l'URL (?variant=…), comme sur Shopify, pour pouvoir la partager.
  useEffect(() => {
    if (!variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", String(variant.id));
    window.history.replaceState(window.history.state, "", url);
  }, [variant]);

  // Barre d'achat collante sur mobile quand le bouton principal sort de l'écran.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function choose(optionIndex: number, valueId: number) {
    const next = selected.map((id, i) => (i === optionIndex ? valueId : id));
    setSelected(next);
    const match = product.variants.find((v) => next.every((id) => v.optionIds.includes(id)));
    const imgIndex = match ? product.images.findIndex((img) => img.variantIds.includes(match.id)) : -1;
    if (imgIndex !== -1) setImageIndex(imgIndex);
  }

  /** Une valeur est grisée si aucune variante disponible ne l'utilise avec les autres choix actuels. */
  function valueAvailable(optionIndex: number, valueId: number) {
    const probe = selected.map((id, i) => (i === optionIndex ? valueId : id));
    return product.variants.some((v) => v.available && probe.every((id) => v.optionIds.includes(id)));
  }

  function buildItem(): CartItem | null {
    if (!variant) return null;
    const img = product.images.find((i) => i.variantIds.includes(variant.id)) ?? image;
    return {
      kind: "collection",
      key: `c:${product.id}:${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title,
      image: img?.src ?? "",
      price: variant.price,
      quantity,
    };
  }

  const handleAdd = () => {
    const item = buildItem();
    if (item) add(item);
  };
  const handleBuyNow = () => {
    const item = buildItem();
    if (item) checkout([item], { clearCart: false });
  };

  const isHoodie = /sweat|hoodie|capuche/i.test(product.title);
  const hasSizes = product.options.some((o) => isSizeOption(o) && o.values.length > 1);

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
      {/* Galerie */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-surface">
          {image && <Image key={image.src} src={image.src} alt={product.title} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Image ${i + 1}`}
                aria-current={i === imageIndex}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden bg-surface ring-offset-2 ring-offset-bg ${i === imageIndex ? "ring-2 ring-fg" : "opacity-70 hover:opacity-100"}`}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="md:sticky md:top-32 md:self-start">
        <h1 className="text-3xl md:text-[40px]">{product.title}</h1>
        {rating && rating.count > 0 && (
          <a href="#avis" className="mt-3 inline-flex items-center gap-2 text-sm">
            <Stars rating={rating.average} /> <span className="text-muted underline underline-offset-4">{rating.count} avis</span>
          </a>
        )}
        <p className="mt-4 text-lg text-fg">{variant ? formatPrice(variant.price) : "—"}</p>
        <p className="mt-2 text-sm">
          {canBuy ? <span className="text-success">● Disponible, imprimé à la demande</span> : <span className="text-muted">Épuisé</span>}
        </p>

        <div className="mt-8 space-y-6">
          {product.options.map((option, oi) => {
            const values = usedValues(product, option);
            const current = option.values.find((v) => v.id === selected[oi]);
            const color = isColorOption(option);
            return (
              <fieldset key={option.name}>
                <div className="mb-3 flex items-center justify-between">
                  <legend className="text-sm">
                    {option.name} : <span className="font-semibold">{current?.title}</span>
                  </legend>
                  {isSizeOption(option) && hasSizes && <SizeGuide kind={isHoodie ? "hoodie" : "tshirt"} />}
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => {
                    const active = selected[oi] === v.id;
                    const ok = valueAvailable(oi, v.id);
                    return color ? (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => choose(oi, v.id)}
                        aria-label={`${v.title}${ok ? "" : " (épuisé)"}`}
                        aria-pressed={active}
                        title={v.title}
                        className={`relative h-10 w-10 rounded-full border border-line ring-offset-2 ring-offset-bg ${active ? "ring-2 ring-fg" : "hover:ring-1 hover:ring-muted"} ${ok ? "" : "opacity-40"}`}
                        style={{ background: colorHex(v.title) }}
                      />
                    ) : (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => choose(oi, v.id)}
                        aria-pressed={active}
                        className={`min-w-14 border px-4 py-2.5 text-sm transition ${
                          active ? "border-fg bg-fg text-bg" : "border-line-strong hover:border-fg"
                        } ${ok ? "" : "text-muted line-through decoration-1"}`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          <div>
            <p className="mb-3 text-sm">Quantité</p>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex gap-3">
            <button ref={buttonRef} type="button" onClick={handleAdd} disabled={!canBuy} className="btn btn-outline flex-1">
              {!variant ? "Combinaison indisponible" : !canBuy ? "Épuisé" : "Ajouter au panier"}
            </button>
            <WishlistButton product={toSnapshot(product)} variant="inline" />
          </div>
          <button type="button" onClick={handleBuyNow} disabled={!canBuy || loading} className="btn w-full">
            {loading ? "Redirection…" : "Acheter maintenant"}
          </button>
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-muted">
          <li className=" bg-surface px-2 py-4"><SparkIcon className="mx-auto mb-2 h-5 w-5 text-fg" />Imprimé à la demande</li>
          <li className=" bg-surface px-2 py-4"><ShieldIcon className="mx-auto mb-2 h-5 w-5 text-fg" />Paiement sécurisé</li>
          <li className=" bg-surface px-2 py-4"><ChatIcon className="mx-auto mb-2 h-5 w-5 text-fg" />Support WhatsApp</li>
        </ul>

        <div className="mt-8">{children}</div>
      </div>

      {/* Barre d'achat collante (mobile) */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur transition-transform md:hidden ${showSticky ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <p className="text-xs text-muted">{variant ? `${variant.title} · ${formatPrice(variant.price)}` : ""}</p>
          </div>
          <button type="button" onClick={handleAdd} disabled={!canBuy} className="btn px-5 py-3">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
