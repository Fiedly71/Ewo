import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/accordion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { ProductView } from "@/components/product-view";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ReviewsSection } from "@/components/reviews-section";
import { collectionName, getProductById, getRelatedProducts } from "@/lib/catalog";
import { config } from "@/lib/config";
import { defaultImage, isAvailable, priceRange, slugify, stripHtml, toSnapshot } from "@/lib/product-utils";
import { getReviews, summarize } from "@/lib/reviews";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/produits/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produit introuvable" };
  const description = stripHtml(product.description).slice(0, 160);
  const image = defaultImage(product)?.src;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/produits/${id}` },
    openGraph: { title: product.title, description, images: image && !image.endsWith(".svg") ? [image] : undefined },
  };
}

export default async function ProductPage({ params, searchParams }: PageProps<"/produits/[id]">) {
  const { id } = await params;
  const { variant } = await searchParams;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([getRelatedProducts(product), getReviews(product.id)]);
  const summary = summarize(reviews);
  const collection = collectionName(product);
  const collectionSlug = slugify(collection) || "nouveautes";
  const { min, max } = priceRange(product);
  const image = defaultImage(product)?.src;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        description: stripHtml(product.description),
        image: image ? [image.startsWith("http") ? image : `${site.url}${image}`] : undefined,
        sku: product.id,
        brand: { "@type": "Brand", name: site.name },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: config.currency.toUpperCase(),
          lowPrice: (min / 100).toFixed(2),
          highPrice: (max / 100).toFixed(2),
          offerCount: product.variants.length,
          availability: isAvailable(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
        ...(summary.count > 0 && {
          aggregateRating: { "@type": "AggregateRating", ratingValue: summary.average.toFixed(1), reviewCount: summary.count },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
          { "@type": "ListItem", position: 2, name: collection, item: `${site.url}/collections/${collectionSlug}` },
          { "@type": "ListItem", position: 3, name: product.title },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="page py-6 md:py-10">
        <Breadcrumbs
          items={[
            { href: "/", label: "Accueil" },
            { href: `/collections/${collectionSlug}`, label: collection },
            { label: product.title },
          ]}
        />
        <div className="mt-6">
          <ProductView
            product={product}
            initialVariantId={Number(Array.isArray(variant) ? variant[0] : variant) || undefined}
            collection={collection}
            rating={{ average: summary.average, count: summary.count }}
          >
            <Accordion
              defaultOpen={0}
              items={[
                {
                  title: "Description",
                  // La description vient de la boutique Printify du propriétaire du site.
                  content: <div className="rte" dangerouslySetInnerHTML={{ __html: product.description }} />,
                },
                {
                  title: "Livraison",
                  content: "Fabriqué à la demande en 2 à 5 jours ouvrés, puis expédié vers l'adresse Ewo prédéfinie. Nous vous prévenons dès réception de votre colis.",
                },
                {
                  title: "Retours et échanges",
                  content: "Article fabriqué sur commande : pas de retour pour une erreur de taille. Un article défectueux ou mal imprimé est remplacé ou remboursé sous 30 jours.",
                },
                {
                  title: "Entretien",
                  content: "Lavage en machine à 30 °C sur l'envers, pas de sèche-linge, repassage sur l'envers en évitant l'impression.",
                },
              ]}
            />
          </ProductView>
        </div>
      </div>

      <ReviewsSection productId={product.id} reviews={reviews} summary={summary} />

      {related.length > 0 && (
        <section className="page mt-20">
          <h2 className="text-2xl">Vous aimerez aussi</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed current={toSnapshot(product)} />
    </>
  );
}
