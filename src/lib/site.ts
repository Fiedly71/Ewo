import { config } from "./config";

/** Informations de la marque : modifiez-les ici ou via les variables d'environnement. */
export const site = {
  name: "Ewo",
  tagline: "Vêtements personnalisés et collections, imprimés à la demande.",
  url: config.siteUrl.replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  announcements: [
    "Impression à la demande : zéro stock, zéro gaspillage",
    "Créez votre vêtement personnalisé en 3 étapes",
    "Paiement 100 % sécurisé · Support sur WhatsApp",
  ],
  socials: [
    { name: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "" },
    { name: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "" },
    { name: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "" },
  ].filter((s) => s.href),
  /** Raison sociale et adresse, affichées dans les mentions légales. */
  legal: {
    company: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "Ewo",
    address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "",
  },
};
