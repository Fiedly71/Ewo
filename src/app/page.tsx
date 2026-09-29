import Image from "next/image";
import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { GalleryTabs } from "@/components/gallery-tabs";
import { WhatsAppIcon } from "@/components/whatsapp-button";
import { getCollections } from "@/lib/catalog";
import { whatsappLink } from "@/lib/contact";

const offers = [
  {
    title: "T-shirts personnalisés",
    text: "Votre image, votre texte ou votre logo imprimé sur un t-shirt unisexe, en plusieurs couleurs et tailles.",
    href: "/personnaliser",
  },
  {
    title: "Sweats à capuche",
    text: "Le même principe sur un sweat épais : idéal pour une équipe, un événement ou un cadeau.",
    href: "/personnaliser",
  },
  {
    title: "Collections Ewo",
    text: "Des modèles déjà créés par Ewo, prêts à commander en un clic.",
    href: "/collections",
  },
];

const facts = [
  { value: "0", label: "stock : tout est imprimé à la demande" },
  { value: "3", label: "étapes pour créer votre vêtement" },
  { value: "100 %", label: "paiement en ligne sécurisé" },
];

export default async function Home() {
  const collections = await getCollections();
  const heroImages = collections.flatMap((c) => c.items).slice(0, 3).map((p) => p.images[0]?.src).filter(Boolean);

  return (
    <>
      <DemoBanner />

      <section className="relative grid gap-10 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 md:grid-cols-2 md:items-center md:px-12">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">Impression à la demande</p>
          <h1 className="mt-3 text-4xl leading-tight font-black md:text-6xl">
            Portez vos idées, <span className="text-accent">en vrai.</span>
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Ajoutez votre image sur un t-shirt ou un sweat, ou choisissez une pièce dans nos collections. Chaque
            vêtement est imprimé pour vous.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/personnaliser" className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg">
              Créer mon vêtement
            </Link>
            <Link href="/collections" className="rounded-full border border-line px-6 py-3 font-semibold hover:border-accent">
              Voir les collections
            </Link>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl border border-line ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
            >
              <Image src={src!} alt="" fill priority={i === 0} sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl bg-accent px-6 py-6 text-accent-fg">
            <p className="text-4xl font-black">{f.value}</p>
            <p className="mt-1 text-sm opacity-90">{f.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <p className="text-center text-sm font-semibold tracking-widest text-accent uppercase">Ce que nous proposons</p>
        <h2 className="mt-2 text-center text-3xl font-black md:text-4xl">
          Des vêtements à <span className="text-accent">votre image</span>
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {offers.map((o, i) => (
            <Link key={o.title} href={o.href} className="group rounded-2xl border border-line bg-surface p-6 hover:border-accent">
              <p className="text-sm font-bold text-accent">0{i + 1}</p>
              <h3 className="mt-3 text-xl font-bold">{o.title}</h3>
              <p className="mt-2 text-sm text-muted">{o.text}</p>
              <p className="mt-5 text-sm font-semibold text-accent">Découvrir →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-center text-sm font-semibold tracking-widest text-accent uppercase">Galerie</p>
        <h2 className="mt-2 mb-8 text-center text-3xl font-black md:text-4xl">Nos créations</h2>
        <GalleryTabs collections={collections} />
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {["Choisissez un vêtement, sa couleur et sa taille", "Ajoutez votre image ou prenez un modèle Ewo", "Payez en ligne, on imprime et on expédie"].map(
          (step, i) => (
            <div key={step} className="flex items-center gap-4 rounded-2xl border border-line p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-bold text-accent-fg">{i + 1}</span>
              <p className="text-sm">{step}</p>
            </div>
          ),
        )}
      </section>

      <section className="relative mt-20 overflow-hidden rounded-3xl bg-accent px-6 py-14 text-center text-accent-fg md:px-12">
        <h2 className="text-3xl font-black md:text-4xl">Prêt à créer votre vêtement ?</h2>
        <p className="mx-auto mt-3 max-w-lg opacity-90">
          Lancez-vous en ligne, ou écrivez-nous pour une commande de groupe ou une question.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/personnaliser" className="rounded-full bg-black px-6 py-3 font-semibold text-white">
            Commencer
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 font-semibold"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
