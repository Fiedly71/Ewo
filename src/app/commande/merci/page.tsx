import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";
import { whatsappLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Merci", robots: { index: false } };

const steps = [
  { title: "Paiement confirmé", text: "Vous recevez un reçu par email de la part de Stripe." },
  { title: "Impression", text: "Votre commande part chez Printify et est fabriquée en 2 à 5 jours ouvrés." },
  { title: "Livraison", text: "Le colis est expédié vers l'adresse Ewo. Nous vous prévenons dès son arrivée." },
];

export default async function ThanksPage({ searchParams }: PageProps<"/commande/merci">) {
  const { demo, session_id } = await searchParams;
  const ref = typeof session_id === "string" ? session_id.slice(-10).toUpperCase() : null;
  return (
    <div className="page max-w-2xl py-16 text-center">
      <ClearCart />
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-3xl text-success">✓</div>
      <h1 className="mt-6 text-3xl md:text-[40px]">Merci pour votre commande !</h1>
      <p className="mt-4 text-muted">
        {demo
          ? "Mode démo : aucun paiement n'a été pris et aucune commande n'a été envoyée à Printify."
          : "Votre paiement est confirmé et votre commande part en impression."}
      </p>
      {ref && <p className="mt-2 text-sm">Référence : <span className="font-mono font-semibold">{ref}</span></p>}
      <ol className="mt-10 space-y-4 text-left">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4 border border-line p-5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fg text-sm font-bold text-bg">{i + 1}</span>
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/collections/tous" className="btn">Continuer mes achats</Link>
        <a href={whatsappLink(`Bonjour Ewo, j'ai une question sur ma commande${ref ? ` ${ref}` : ""}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Une question ? WhatsApp
        </a>
      </div>
    </div>
  );
}
