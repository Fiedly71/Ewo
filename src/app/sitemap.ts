import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/catalog";
import { policies } from "@/lib/policies";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProducts().catch(() => []), getCollections().catch(() => [])]);
  const staticPages = ["", "/collections", "/collections/tous", "/personnaliser", "/a-propos", "/faq", "/contact"];
  return [
    ...staticPages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: `${site.url}/collections/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/produits/${p.id}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...policies.map((p) => ({ url: `${site.url}/politiques/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
