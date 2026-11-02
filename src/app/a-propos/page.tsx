import type { Metadata } from "next";
import Link from "next/link";
import { ChatIcon, SparkIcon, UploadIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "À propos",
  description: "Ewo crée des vêtements personnalisés et des collections imprimés à la demande.",
  alternates: { canonical: "/a-propos" },
};

const values = [
  { icon: SparkIcon, title: "Zéro stock, zéro gaspillage", text: "Rien n'est fabriqué à l'avance : chaque pièce est imprimée après votre commande." },
  { icon: UploadIcon, title: "Votre créativité d'abord", text: "Une photo, un logo, un dessin : nous vous donnons les outils pour porter vos idées." },
  { icon: ChatIcon, title: "Proches de vous", text: "Une vraie personne vous répond sur WhatsApp, avant comme après votre commande." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="page py-20 text-center md:py-28">
          <p className="eyebrow">Notre histoire</p>
          {/* Texte de présentation à personnaliser avec l'histoire réelle de la marque. */}
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight text-balance md:text-6xl">
            Des vêtements qui vous <span className="text-accent">ressemblent</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Ewo est née d&apos;une idée simple : chacun devrait pouvoir porter ses propres créations, sans commander cent pièces ni se ruiner. Nous imprimons à la demande, une pièce à la fois.
          </p>
        </div>
      </section>
      <section className="page mt-20 grid gap-10 md:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-line p-8">
            <Icon className="h-8 w-8 text-accent" />
            <p className="mt-5 text-lg font-semibold">{title}</p>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>
      <section className="page mt-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Prêt·e à créer ?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/personnaliser" className="btn btn-primary">Créer mon vêtement</Link>
          <Link href="/collections/tous" className="btn btn-outline">Voir la boutique</Link>
        </div>
      </section>
    </>
  );
}
