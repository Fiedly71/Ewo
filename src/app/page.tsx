import Image from "next/image";
import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { ProductGrid } from "@/components/product-card";
import { getCollections, getNewArrivals, getProducts } from "@/lib/catalog";
import { whatsappLink } from "@/lib/contact";
import { defaultImage } from "@/lib/product-utils";
import { site } from "@/lib/site";

const perks = [
  ["Imprimé à la demande", "Chaque pièce est fabriquée pour vous"],
  ["Paiement sécurisé", "Carte, Apple Pay ou Google Pay"],
  ["100 % personnalisable", "Votre image sur t-shirt ou sweat"],
  ["Service client", "Par WhatsApp, avant et après l'achat"],
];

const steps = [
  ["Choisissez votre vêtement", "T-shirt ou sweat à capuche, la couleur et la taille."],
  ["Ajoutez votre image", "Photo, logo ou dessin, en PNG ou JPG."],
  ["On imprime et on livre", "Paiement en ligne, fabrication en 2 à 5 jours ouvrés."],
];

export default async function Home() {
  const [collections, newArrivals, all] = await Promise.all([getCollections(), getNewArrivals(8), getProducts()]);
  // Sans données de ventes, « Meilleures ventes » montre l'ordre de la boutique Printify.
  const bestSellers = all.slice(0, 8);
  const hero = newArrivals[0] ?? all[0];
  const heroImage = hero && defaultImage(hero);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: site.name, url: site.url, logo: `${site.url}/icon.svg` },
      {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        potentialAction: { "@type": "SearchAction", target: `${site.url}/recherche?q={search_term_string}`, "query-input": "required name=search_term_string" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Bannière principale */}
      <section className="bg-cream">
        <div className="page grid min-h-[440px] items-center gap-8 py-12 md:min-h-[560px] md:grid-cols-2 md:gap-10 md:py-16">
          <div className="order-2 md:order-1">
            <p className="eyebrow">Ewo · Impression à la demande</p>
            <h1 className="h-display mt-4">Portez vos idées, en vrai.</h1>
            <p className="mt-5 max-w-md text-[17px]">
              Créez votre vêtement avec votre propre image, ou choisissez une pièce dans nos collections. Chaque article est imprimé rien que pour vous.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/tous" className="btn">Découvrir la boutique</Link>
              <Link href="/personnaliser" className="btn btn-outline">Créer mon vêtement</Link>
            </div>
            <DemoBanner className="mt-8 max-w-md text-left" />
          </div>
          <div className="order-1 flex justify-center md:order-2">
            {heroImage ? (
              <Link href={`/produits/${hero.id}`} className="relative block aspect-square w-[260px] overflow-hidden md:w-[460px]">
                <Image src={heroImage.src} alt={hero.title} fill priority sizes="(min-width: 768px) 460px, 260px" className="object-cover" />
              </Link>
            ) : (
              <p className="text-[120px] leading-none font-bold text-fg md:text-[200px]">EW<span className="text-accent">O</span></p>
            )}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="border-b border-line">
        <ul className="page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {perks.map(([title, text]) => (
            <li key={title}>
              <p className="text-[15px] text-fg">{title}</p>
              <p className="text-sm">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Catégories */}
      {collections.length > 0 && (
        <section className="page py-14 md:py-20">
          <h2 className="h-section">Acheter par catégorie</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {collections.map((c) => {
              const img = c.items[0] && defaultImage(c.items[0]);
              return (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-surface">
                      {img && <Image src={img.src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-opacity group-hover:opacity-90" />}
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-[17px] text-fg">
                      <span className="group-hover:underline group-hover:underline-offset-4">{c.name}</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Meilleures ventes */}
      {bestSellers.length > 0 && (
        <section className="page pb-14 md:pb-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="h-section">Meilleures ventes</h2>
            <Link href="/collections/tous" className="link text-sm">Tout voir</Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      {/* Personnalisation */}
      <section className="bg-accent text-white">
        <div className="page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="h-section text-white">Créez votre propre vêtement</h2>
            <p className="mt-4 max-w-lg text-white/85">
              Logo d&apos;équipe, photo de famille, illustration ou texte : téléversez votre visuel, on s&apos;occupe de l&apos;impression et de la livraison. Dès une seule pièce.
            </p>
            <Link href="/personnaliser" className="btn btn-sun mt-8">Commencer ma création</Link>
          </div>
          <ol className="grid gap-6 self-center">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex gap-5 border-t border-white/25 pt-5">
                <span className="text-3xl font-semibold text-sun">0{i + 1}</span>
                <div>
                  <p className="text-white">{title}</p>
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Nouveautés */}
      {newArrivals.length > 0 && (
        <section className="page py-14 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="h-section">Nouveautés</h2>
            <Link href="/collections/tous?tri=nouveautes" className="link text-sm">Tout voir</Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* Commandes de groupe */}
      <section className="bg-cream">
        <div className="page flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="h-section">Une commande pour un groupe ?</h2>
            <p className="mt-3 max-w-xl">Équipe, association, événement ou entreprise : écrivez-nous pour un tarif adapté aux grandes quantités.</p>
          </div>
          <a href={whatsappLink("Bonjour Ewo, je voudrais un devis pour une commande de groupe.")} target="_blank" rel="noopener noreferrer" className="btn shrink-0">
            Demander un devis
          </a>
        </div>
      </section>
    </>
  );
}
