import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { DemoBanner } from "@/components/demo-banner";
import { ArrowRight, ChatIcon, ShieldIcon, SparkIcon, TruckIcon, UploadIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { getCollections, getNewArrivals } from "@/lib/catalog";
import { site } from "@/lib/site";
import { defaultImage } from "@/lib/product-utils";

const perks = [
  { icon: SparkIcon, title: "Imprimé à la demande", text: "Chaque pièce est fabriquée pour vous, sans stock ni gaspillage." },
  { icon: UploadIcon, title: "100 % personnalisable", text: "Votre image, votre logo ou votre texte sur un t-shirt ou un sweat." },
  { icon: ShieldIcon, title: "Paiement sécurisé", text: "Carte, Apple Pay ou Google Pay via Stripe." },
  { icon: ChatIcon, title: "Support humain", text: "Une question ? On vous répond sur WhatsApp." },
];

const faq = [
  { title: "Combien de temps pour recevoir ma commande ?", content: "Comptez 2 à 5 jours ouvrés de fabrication, puis le temps de livraison jusqu'à l'adresse Ewo. Nous vous prévenons dès que votre colis est arrivé." },
  { title: "Quelle image puis-je utiliser pour personnaliser ?", content: "Une image PNG ou JPG nette (idéalement 2000 px de large ou plus) dont vous détenez les droits. Un fond transparent (PNG) donne le meilleur rendu." },
  { title: "Puis-je retourner un article ?", content: "Les articles étant fabriqués sur commande, ils ne sont ni repris ni échangés pour une erreur de taille. Un article défectueux ou mal imprimé est remplacé ou remboursé." },
];

export default async function Home() {
  const [collections, newArrivals] = await Promise.all([getCollections(), getNewArrivals(8)]);
  const heroProducts = newArrivals.slice(0, 3);

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
      <section className="relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow text-accent">Nouvelle saison · Impression à la demande</p>
            <h1 className="mt-4 text-5xl leading-[1.02] font-black tracking-tight text-balance md:text-7xl">
              Portez vos idées, <span className="text-accent">en vrai.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Créez votre vêtement avec votre propre image ou choisissez une pièce dans nos collections. Chaque article est imprimé rien que pour vous.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/collections/tous" className="btn btn-primary px-7">Découvrir la boutique</Link>
              <Link href="/personnaliser" className="btn btn-outline px-7">Créer mon vêtement</Link>
            </div>
            <DemoBanner className="mt-8 max-w-md text-left" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {heroProducts.map((p, i) => {
              const img = defaultImage(p);
              return (
                <Link
                  key={p.id}
                  href={`/produits/${p.id}`}
                  className={`group relative overflow-hidden rounded-2xl bg-bg shadow-sm ${i === 0 ? "row-span-2 aspect-[4/7]" : "aspect-square"}`}
                >
                  {img && <Image src={img.src} alt={p.title} fill priority={i === 0} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                  <span className="absolute bottom-3 left-3 rounded-full bg-bg/90 px-3 py-1 text-xs font-medium backdrop-blur">{p.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bandeau défilant */}
      <div className="overflow-hidden border-y border-line py-4">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12 text-sm font-semibold tracking-wide whitespace-nowrap uppercase">
          {[...Array(2)].flatMap((_, k) =>
            ["T-shirts personnalisés", "Sweats à capuche", "Collections Ewo", "Imprimé à la demande", "Paiement sécurisé", "Support WhatsApp"].map((t) => (
              <span key={`${k}-${t}`} className="flex items-center gap-12" aria-hidden={k === 1}>
                {t} <span className="text-accent">✦</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* Collections */}
      <section className="page mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Acheter par collection</h2>
          </div>
          <Link href="/collections" className="hidden items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline sm:flex">
            Toutes les collections <ArrowRight />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {collections.slice(0, 4).map((c) => {
            const img = c.items[0] && defaultImage(c.items[0]);
            return (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface">
                {img && <Image src={img.src} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-lg font-semibold">{c.name}</p>
                  <p className="flex items-center gap-1 text-sm opacity-80">
                    {c.items.length} produit{c.items.length > 1 ? "s" : ""} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Nouveautés */}
      <section className="page mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Nouveautés</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Fraîchement imprimés</h2>
          </div>
          <Link href="/collections/tous?tri=nouveautes" className="flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
            Tout voir <ArrowRight />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Personnalisation */}
      <section className="page mt-24">
        <div className="grid overflow-hidden rounded-2xl bg-fg text-bg md:grid-cols-2">
          <div className="p-8 md:p-14">
            <p className="eyebrow text-accent">Personnalisation</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Votre image. Votre vêtement.</h2>
            <p className="mt-4 max-w-md opacity-75">
              Logo d&apos;équipe, photo, illustration ou texte : téléversez votre visuel, choisissez la couleur et la taille, on s&apos;occupe du reste.
            </p>
            <ol className="mt-8 space-y-4">
              {["Choisissez un t-shirt ou un sweat", "Ajoutez votre image (PNG ou JPG)", "Payez en ligne, on imprime et on expédie"].map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">{i + 1}</span>
                  <span className="text-sm">{s}</span>
                </li>
              ))}
            </ol>
            <Link href="/personnaliser" className="btn btn-accent mt-10 px-7">Commencer ma création</Link>
          </div>
          <div className="relative min-h-72" style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--accent) 45%, transparent) 0%, transparent 65%)" }}>
            <svg viewBox="0 0 256 256" className="absolute inset-0 m-auto h-[85%] w-[85%] drop-shadow-2xl" aria-hidden="true">
              <path d="M60 40 L100 20 Q128 40 156 20 L196 40 L236 90 L200 115 L185 95 L185 240 L71 240 L71 95 L56 115 L20 90 Z" fill="#fbfbf9" />
              <rect x="88" y="80" width="80" height="100" rx="6" fill="none" stroke="#f47a1f" strokeWidth="2" strokeDasharray="5 5" />
              <text x="128" y="126" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="15" fill="#1d1d1f">VOTRE</text>
              <text x="128" y="146" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="15" fill="#f47a1f">IMAGE</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="page mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-surface">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="page mt-24 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Tout savoir avant de commander</h2>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
            Voir toute la FAQ <ArrowRight />
          </Link>
        </div>
        <Accordion items={faq} defaultOpen={0} />
      </section>

      {/* Newsletter */}
      <section className="page mt-24">
        <div className="rounded-2xl bg-surface px-6 py-14 text-center md:px-12">
          <TruckIcon className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Rejoignez la communauté Ewo</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Nouvelles collections, drops limités et offres réservées aux abonnés. Pas de spam, promis.</p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
