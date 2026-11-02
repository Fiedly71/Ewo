import Link from "next/link";
import { whatsappDisplay, whatsappLink } from "@/lib/contact";
import { site } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Boutique",
    links: [
      { href: "/collections/tous", label: "Tous les produits" },
      { href: "/collections/tous?tri=nouveautes", label: "Nouveautés" },
      { href: "/collections", label: "Collections" },
      { href: "/personnaliser", label: "Personnaliser un vêtement" },
      { href: "/favoris", label: "Mes favoris" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/politiques/livraison", label: "Livraison" },
      { href: "/politiques/retours", label: "Retours et remboursements" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Ewo",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/politiques/cgv", label: "Conditions de vente" },
      { href: "/politiques/confidentialite", label: "Confidentialité" },
      { href: "/politiques/mentions-legales", label: "Mentions légales" },
    ],
  },
];

const payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-2xl font-black">EW<span className="text-accent">O</span></p>
          <p className="mt-3 text-sm text-muted">{site.tagline}</p>
          <p className="mt-6 text-sm font-semibold">Nouveautés et offres en avant-première</p>
          <div className="mt-3">
            <NewsletterForm source="footer" />
          </div>
          {site.socials.length > 0 && (
            <div className="mt-6 flex gap-4 text-sm">
              {site.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg">
                  {s.name}
                </a>
              ))}
            </div>
          )}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-semibold">{col.title}</p>
            <ul className="space-y-2.5 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-fg">{l.label}</Link>
                </li>
              ))}
              {col.title === "Aide" && (
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                    WhatsApp {whatsappDisplay}
                  </a>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="page flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Impression et expédition par Printify.</p>
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Moyens de paiement acceptés">
            {payments.map((p) => (
              <li key={p} className="rounded border border-line bg-bg px-2 py-1 font-semibold text-fg/70">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
