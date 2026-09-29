import "server-only";
import { printifyEnabled } from "./config";
import { demoBaseVariants, demoProducts } from "./demo-data";
import * as printify from "./printify";
import type { CustomBase } from "./types";

export async function getProducts() {
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

/** Regroupe les produits par collection (premier tag Printify). */
export async function getCollections() {
  const products = await getProducts();
  const map = new Map<string, typeof products>();
  for (const p of products) {
    const name = p.tags[0] ?? "Nouveautés";
    map.set(name, [...(map.get(name) ?? []), p]);
  }
  return [...map.entries()].map(([name, items]) => ({ name, items }));
}
