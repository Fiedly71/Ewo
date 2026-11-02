import "server-only";
import { printifyEnabled } from "./config";
import { demoBaseVariants, demoProducts } from "./demo-data";
import * as printify from "./printify";
import { slugify, stripHtml } from "./product-utils";
import type { CustomBase, Product } from "./types";

export type Collection = { slug: string; name: string; items: Product[] };

export const ALL_SLUG = "tous";

export async function getProducts(): Promise<Product[]> {
  return printifyEnabled() ? printify.listProducts() : demoProducts;
}

export async function getProductById(id: string) {
  return printifyEnabled() ? printify.getProduct(id) : (demoProducts.find((p) => p.id === id) ?? null);
}

export async function getBaseVariants(base: CustomBase) {
  return printifyEnabled()
    ? printify.getBlueprintVariants(base.blueprintId, base.printProviderId)
    : demoBaseVariants;
}

export const collectionName = (p: Product) => p.tags[0] ?? "Nouveautés";

/** Regroupe les produits par collection (premier tag Printify). */
export async function getCollections(): Promise<Collection[]> {
  const products = await getProducts();
  const map = new Map<string, Collection>();
  for (const p of products) {
    const name = collectionName(p);
    const slug = slugify(name) || "nouveautes";
    const c = map.get(slug) ?? { slug, name, items: [] };
    c.items.push(p);
    map.set(slug, c);
  }
  return [...map.values()];
}

export async function getCollection(slug: string): Promise<Collection | null> {
  if (slug === ALL_SLUG) return { slug, name: "Tous les produits", items: await getProducts() };
  return (await getCollections()).find((c) => c.slug === slug) ?? null;
}

export async function getNewArrivals(limit = 8) {
  const products = await getProducts();
  return [...products]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProducts();
  const name = collectionName(product);
  const same = products.filter((p) => p.id !== product.id && collectionName(p) === name);
  const others = products.filter((p) => p.id !== product.id && collectionName(p) !== name);
  return [...same, ...others].slice(0, limit);
}

/** Recherche simple, insensible aux accents, sur le titre, les tags et la description. */
export async function searchProducts(query: string) {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(/\s+/);
  const products = await getProducts();
  return products
    .map((p) => {
      const title = normalize(p.title);
      const haystack = `${title} ${normalize(p.tags.join(" "))} ${normalize(stripHtml(p.description))}`;
      if (!terms.every((t) => haystack.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 2 : 1), 0);
      return { p, score };
    })
    .filter((r) => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
