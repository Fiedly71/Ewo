import type { ActiveFilters, Facets } from "@/components/collection-filters";
import { colorNames, compareSizes, isAvailable, priceRange, sizeNames } from "./product-utils";
import type { Product } from "./types";

type SP = Record<string, string | string[] | undefined>;
const list = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export const PAGE_SIZE = 24;

export function parseFilters(sp: SP): ActiveFilters & { page: number } {
  return {
    sizes: list(sp.taille).slice(0, 20),
    colors: list(sp.couleur).slice(0, 20),
    min: one(sp.prix_min).replace(/[^\d]/g, "").slice(0, 7),
    max: one(sp.prix_max).replace(/[^\d]/g, "").slice(0, 7),
    available: one(sp.dispo) === "1",
    sort: one(sp.tri),
    q: one(sp.q).slice(0, 100) || undefined,
    page: Math.max(1, Math.floor(Number(one(sp.page)) || 1)),
  };
}

export function facetsFor(products: Product[]): Facets {
  const sizes = new Map<string, number>();
  const colors = new Map<string, number>();
  for (const p of products) {
    for (const s of sizeNames(p)) sizes.set(s, (sizes.get(s) ?? 0) + 1);
    for (const c of colorNames(p)) colors.set(c, (colors.get(c) ?? 0) + 1);
  }
  return {
    sizes: [...sizes].map(([value, count]) => ({ value, count })).sort((a, b) => compareSizes(a.value, b.value)),
    colors: [...colors].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "fr")),
  };
}

/** Applique filtres et tri. Les bornes de prix sont saisies en unités (ex. 25 = 25,00). */
export function applyFilters(products: Product[], f: ActiveFilters) {
  const min = f.min ? Number(f.min) * 100 : 0;
  const max = f.max ? Number(f.max) * 100 : Infinity;
  const result = products.filter((p) => {
    if (f.available && !isAvailable(p)) return false;
    if (f.sizes.length && !sizeNames(p).some((s) => f.sizes.includes(s))) return false;
    if (f.colors.length && !colorNames(p).some((c) => f.colors.includes(c))) return false;
    const price = priceRange(p).min;
    return price >= min && price <= max;
  });
  switch (f.sort) {
    case "nouveautes":
      return result.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    case "prix-asc":
      return result.sort((a, b) => priceRange(a).min - priceRange(b).min);
    case "prix-desc":
      return result.sort((a, b) => priceRange(b).min - priceRange(a).min);
    case "az":
      return result.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    default:
      return result;
  }
}

export function activeCount(f: ActiveFilters) {
  return f.sizes.length + f.colors.length + (f.min || f.max ? 1 : 0) + (f.available ? 1 : 0);
}
