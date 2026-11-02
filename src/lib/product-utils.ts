import type { Product, ProductOption } from "./types";

/** Fonctions partagées serveur / navigateur autour des produits. */
export const isColorOption = (o: ProductOption) => /colou?r|couleur/i.test(o.name);
export const isSizeOption = (o: ProductOption) => /size|taille/i.test(o.name);

export function defaultImage(product: Product) {
  return product.images.find((i) => i.isDefault) ?? product.images[0];
}

export function priceRange(product: Product) {
  const prices = product.variants.map((v) => v.price);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Valeurs d'une option réellement utilisées par au moins une variante. */
export function usedValues(product: Product, option: ProductOption) {
  return option.values.filter((v) => product.variants.some((pv) => pv.optionIds.includes(v.id)));
}

export function colorNames(product: Product) {
  const opt = product.options.find(isColorOption);
  return opt ? usedValues(product, opt).map((v) => v.title) : [];
}

export function sizeNames(product: Product) {
  const opt = product.options.find(isSizeOption);
  return opt ? usedValues(product, opt).map((v) => v.title) : [];
}

export function isAvailable(product: Product) {
  return product.variants.some((v) => v.available);
}

const NEW_DAYS = 30;
export function isNew(product: Product, now = Date.now()) {
  if (!product.createdAt) return false;
  return now - new Date(product.createdAt).getTime() < NEW_DAYS * 86_400_000;
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Ordre de tri naturel des tailles. */
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "4XL", "5XL"];
export function compareSizes(a: string, b: string) {
  const ia = SIZE_ORDER.indexOf(a.toUpperCase());
  const ib = SIZE_ORDER.indexOf(b.toUpperCase());
  if (ia === -1 && ib === -1) return a.localeCompare(b, "fr");
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}

/** Instantané léger d'un produit, gardé dans le navigateur (favoris, vus récemment). */
export type ProductSnapshot = { id: string; title: string; image: string; price: number };

export function toSnapshot(product: Product): ProductSnapshot {
  return {
    id: product.id,
    title: product.title,
    image: defaultImage(product)?.src ?? "",
    price: priceRange(product).min,
  };
}
