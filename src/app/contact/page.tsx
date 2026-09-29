import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/whatsapp-button";
import { whatsappDisplay, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Contact" };

const faq = [
  {
    q: "Comment est fabriqué mon vêtement ?",
    a: "Chaque pièce est imprimée à la demande après votre commande, puis expédiée. Il n'y a pas de stock.",
  },
  {
    q: "Quelle image puis-je utiliser ?",
    a: "Une image PNG ou JPG de bonne qualité, idéalement 2000 px de large ou plus, dont vous avez les droits.",
  },
  {
    q: "Où est livrée ma commande ?",
    a: "Toutes les commandes sont livrées à l'adresse Ewo prédéfinie. Écrivez-nous sur WhatsApp pour le retrait.",
  },
];

export default function ContactPage() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">Contact</p>
        <h1 className="mt-2 text-4xl font-black">
          Parlons de votre <span className="text-accent">projet</span>
        </h1>
        <p className="mt-4 text-muted">
          Une question sur une commande, un design ou une commande en grande quantité ? Écrivez-nous, nous répondons
          sur WhatsApp.
        </p>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#25d366] px-6 py-4 font-semibold text-white"
        >
          <WhatsAppIcon />
          Discuter sur WhatsApp
        </a>
        <p className="mt-3 text-sm text-muted">{whatsappDisplay}</p>
      </div>
      <div className="space-y-4">
        {faq.map((item) => (
          <div key={item.q} className="rounded-2xl border border-line bg-surface p-6">
            <p className="font-semibold">{item.q}</p>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
