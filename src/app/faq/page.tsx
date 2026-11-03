import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur les commandes, la personnalisation, la livraison et les retours Ewo.",
  alternates: { canonical: "/faq" },
};

const groups = [
  {
    title: "Commandes et paiement",
    items: [
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard, American Express), Apple Pay et Google Pay, via Stripe. Le paiement est 100 % sécurisé." },
      { q: "Puis-je utiliser un code promo ?", a: "Oui, saisissez-le sur la page de paiement Stripe, dans le champ « Ajouter un code promotionnel »." },
      { q: "Puis-je modifier ou annuler ma commande ?", a: "Écrivez-nous au plus vite sur WhatsApp. Tant que l'impression n'a pas commencé, nous pouvons la modifier ou l'annuler." },
    ],
  },
  {
    title: "Personnalisation",
    items: [
      { q: "Quelle image puis-je utiliser ?", a: "Une image PNG ou JPG de 10 Mo maximum, idéalement 2000 px de large ou plus. Un PNG à fond transparent donne le meilleur rendu." },
      { q: "Où est placée mon image ?", a: "Sur le devant du vêtement, centrée dans la zone d'impression. L'aperçu vous donne une idée du résultat." },
      { q: "Puis-je commander pour une équipe ou un événement ?", a: "Bien sûr. Pour les grandes quantités, contactez-nous sur WhatsApp afin d'obtenir un tarif adapté." },
    ],
  },
  {
    title: "Livraison",
    items: [
      { q: "Où est livrée ma commande ?", a: "Toutes les commandes sont expédiées vers l'adresse Ewo prédéfinie. Nous vous contactons dès réception pour la remise de votre colis." },
      { q: "Quels sont les délais ?", a: "2 à 5 jours ouvrés de fabrication, puis le temps de transport. Comptez en moyenne 7 à 15 jours au total." },
    ],
  },
  {
    title: "Retours",
    items: [
      { q: "Puis-je retourner un article ?", a: "Nos articles sont fabriqués sur commande : ils ne sont pas repris pour une erreur de taille. Un article défectueux ou mal imprimé est remplacé ou remboursé." },
      { q: "Mon article est abîmé, que faire ?", a: "Envoyez-nous une photo sur WhatsApp dans les 30 jours suivant la réception, nous trouvons une solution rapidement." },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };
  return (
    <div className="page max-w-3xl py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <h1 className="text-3xl md:text-[40px]">Questions fréquentes</h1>
      <p className="mt-3 text-muted">
        Vous ne trouvez pas votre réponse ?{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4">Écrivez-nous sur WhatsApp</a>{" "}
        ou passez par la page <Link href="/contact" className="text-fg underline underline-offset-4">Contact</Link>.
      </p>
      {groups.map((g) => (
        <section key={g.title} className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">{g.title}</h2>
          <Accordion items={g.items.map((i) => ({ title: i.q, content: i.a }))} />
        </section>
      ))}
    </div>
  );
}
