import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { getProductById } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/produits/[id]">): Promise<Metadata> {
  const product = await getProductById((await params).id);
  return { title: product?.title ?? "Produit introuvable" };
}

export default async function ProductPage({ params }: PageProps<"/produits/[id]">) {
  const product = await getProductById((await params).id);
  if (!product) notFound();
  return <AddToCart product={product} />;
}
