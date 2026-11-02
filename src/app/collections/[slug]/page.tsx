import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DemoBanner } from "@/components/demo-banner";
import { ProductListing } from "@/components/product-listing";
import { getCollection } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection introuvable" };
  return {
    title: collection.name,
    description: `Découvrez la collection ${collection.name} d'Ewo : ${collection.items.length} vêtements imprimés à la demande.`,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  return (
    <div className="page py-10">
      <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { href: "/collections", label: "Collections" }, { label: collection.name }]} />
      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{collection.name}</h1>
      <DemoBanner className="mt-6" />
      <div className="mt-8">
        <ProductListing products={collection.items} searchParams={await searchParams} basePath={`/collections/${slug}`} />
      </div>
    </div>
  );
}
