import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DemoBanner } from "@/components/demo-banner";
import { ArrowRight } from "@/components/icons";
import { getCollections, getProducts } from "@/lib/catalog";
import { defaultImage } from "@/lib/product-utils";

export const metadata: Metadata = {
  title: "Collections",
  description: "Toutes les collections de vêtements Ewo, imprimés à la demande.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const [collections, all] = await Promise.all([getCollections(), getProducts()]);
  const tiles = [{ slug: "tous", name: "Tous les produits", items: all }, ...collections];
  return (
    <div className="page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { label: "Collections" }]} />
      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Collections</h1>
      <DemoBanner className="mt-6" />
      {all.length === 0 && <p className="mt-10 text-muted">Aucun produit pour le moment.</p>}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {tiles.map((c) => {
          const img = c.items[0] && defaultImage(c.items[0]);
          return (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                {img && <Image src={img.src} alt="" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
              </div>
              <p className="mt-3 flex items-center gap-2 font-semibold">
                {c.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </p>
              <p className="text-sm text-muted">{c.items.length} produit{c.items.length > 1 ? "s" : ""}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
