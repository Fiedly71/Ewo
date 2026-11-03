import Link from "next/link";
import { getCollections } from "@/lib/catalog";
import { whatsappDisplay, whatsappLink } from "@/lib/contact";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

const payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

export async function Footer() {
  const collections = await getCollections().catch(() => []);
  return (
    <footer className="mt-auto border-t border-line">
      <div className="border-b border-line bg-cream">
        <p className="page py-4 text-center text-sm text-fg">
          <strong className="font-semibold text-accent-deep">ℹ </strong>
          Toutes les commandes sont imprimées à la demande puis livrées à l&apos;adresse Ewo. Nous vous contactons dès l&apos;arrivée de votre colis.
        </p>
      </div>
      <div className="page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo className="text-[32px]" />
          <p className="mt-4 text-sm">{site.tagline}</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-5">
            WhatsApp {whatsappDisplay}
          </a>
        </div>
        <div>
          <h2 className="text-[15px]">Boutique</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/collections/tous" className="hover:text-fg hover:underline">Tous les produits</Link></li>
            {collections.map((c) => (
              <li key={c.slug}><Link href={`/collections/${c.slug}`} className="hover:text-fg hover:underline">{c.name}</Link></li>
            ))}
            <li><Link href="/personnaliser" className="hover:text-fg hover:underline">Personnaliser un vêtement</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[15px]">Ewo</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/a-propos" className="hover:text-fg hover:underline">À propos</Link></li>
            <li><Link href="/favoris" className="hover:text-fg hover:underline">Mes favoris</Link></li>
            <li><Link href="/contact" className="hover:text-fg hover:underline">Contact</Link></li>
            <li><Link href="/politiques/cgv" className="hover:text-fg hover:underline">Conditions de vente</Link></li>
            <li><Link href="/politiques/mentions-legales" className="hover:text-fg hover:underline">Mentions légales</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[15px]">Aide</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-fg hover:underline">FAQ</Link></li>
            <li><Link href="/politiques/livraison" className="hover:text-fg hover:underline">Livraison</Link></li>
            <li><Link href="/politiques/retours" className="hover:text-fg hover:underline">Retours et remboursements</Link></li>
            <li><Link href="/politiques/confidentialite" className="hover:text-fg hover:underline">Confidentialité</Link></li>
          </ul>
          <h2 className="mt-6 text-[15px]">Newsletter</h2>
          <div className="mt-3">
            <NewsletterForm source="footer" />
          </div>
          {site.socials.length > 0 && (
            <ul className="mt-5 flex gap-4 text-sm">
              {site.socials.map((s) => (
                <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg hover:underline">{s.name}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="page flex flex-col items-center justify-between gap-3 py-6 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Tous droits réservés. Impression et expédition par Printify.</p>
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Moyens de paiement acceptés">
            {payments.map((p) => (
              <li key={p} className="border border-line px-2 py-0.5 text-fg-soft">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
