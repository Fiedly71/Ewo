import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { ProductCard } from "@/components/product-card";
import { getCollections } from "@/lib/catalog";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <>
      <DemoBanner />
      <h1 className="text-3xl font-black">Collections</h1>
      {collections.length === 0 && <p className="mt-6 text-muted">Aucun produit pour le moment.</p>}
      {collections.map((c) => (
        <section key={c.name} className="mt-10">
          <h2 className="mb-5 text-xl font-bold">{c.name}</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {c.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
