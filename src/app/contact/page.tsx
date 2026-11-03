import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/whatsapp-button";
import { whatsappDisplay, whatsappLink } from "@/lib/contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur une commande ou un projet de vêtements personnalisés ? Contactez Ewo sur WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="page grid gap-12 py-10 md:grid-cols-2 md:py-16">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl font-normal md:text-5xl">
          Parlons de votre <span className="text-accent">projet</span>
        </h1>
        <p className="mt-5 max-w-md text-muted">
          Une question sur une commande, un design ou une commande en grande quantité ? Écrivez-nous, nous répondons rapidement sur WhatsApp.
        </p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-[#25d366] text-white hover:opacity-90">
          <WhatsAppIcon /> Discuter sur WhatsApp
        </a>
        <dl className="mt-10 space-y-4 text-sm">
          <div>
            <dt className="text-muted">WhatsApp</dt>
            <dd className="font-medium">{whatsappDisplay}</dd>
          </div>
          {site.email && (
            <div>
              <dt className="text-muted">Email</dt>
              <dd><a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">{site.email}</a></dd>
            </div>
          )}
          <div>
            <dt className="text-muted">Questions fréquentes</dt>
            <dd><Link href="/faq" className="font-medium underline underline-offset-4">Consulter la FAQ</Link></dd>
          </div>
        </dl>
      </div>
      <div className=" bg-surface p-6 md:p-8">
        <h2 className="text-xl font-semibold">Envoyer un message</h2>
        <p className="mt-1 text-sm text-muted">Votre message s&apos;ouvre dans WhatsApp, prêt à être envoyé.</p>
        <ContactForm />
      </div>
    </div>
  );
}
