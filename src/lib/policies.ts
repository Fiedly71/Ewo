import { whatsappDisplay } from "./contact";
import { site } from "./site";

export type Policy = { slug: string; title: string; updated: string; sections: { heading: string; body: string[] }[] };

const contactLine = `Pour toute question : WhatsApp ${whatsappDisplay}${site.email ? ` ou ${site.email}` : ""}.`;
const company = site.legal.company;
const address = site.legal.address || "[adresse à compléter]";

/**
 * Textes de base des pages légales. Ce sont des modèles : faites-les relire
 * et complétez les informations entre crochets avant la mise en ligne.
 */
export const policies: Policy[] = [
  {
    slug: "livraison",
    title: "Livraison",
    updated: "2 novembre 2026",
    sections: [
      { heading: "Fabrication", body: ["Chaque article est imprimé à la demande par notre partenaire Printify après la validation de votre paiement. La fabrication prend en général 2 à 5 jours ouvrés."] },
      { heading: "Adresse de livraison", body: ["Toutes les commandes sont expédiées vers l'adresse Ewo prédéfinie. Nous vous contactons dès réception pour organiser la remise de votre colis.", "Votre nom, votre email et votre téléphone saisis au paiement servent à identifier votre colis."] },
      { heading: "Délais", body: ["Comptez en moyenne 7 à 15 jours entre la commande et la réception à l'adresse Ewo, selon le produit et le transporteur. Ces délais sont indicatifs."] },
      { heading: "Suivi", body: [contactLine] },
    ],
  },
  {
    slug: "retours",
    title: "Retours et remboursements",
    updated: "2 novembre 2026",
    sections: [
      { heading: "Articles fabriqués sur commande", body: ["Nos vêtements sont imprimés spécialement pour vous. C'est pourquoi nous n'acceptons pas les retours pour un changement d'avis ou une erreur de taille. Consultez le guide des tailles avant de commander."] },
      { heading: "Article défectueux ou erroné", body: ["Si votre article arrive abîmé, mal imprimé ou ne correspond pas à votre commande, écrivez-nous dans les 30 jours suivant la réception avec une photo. Nous le remplaçons ou le remboursons sans frais."] },
      { heading: "Remboursement", body: ["Les remboursements validés sont effectués sur le moyen de paiement utilisé, sous 5 à 10 jours ouvrés."] },
      { heading: "Contact", body: [contactLine] },
    ],
  },
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    updated: "2 novembre 2026",
    sections: [
      { heading: "Objet", body: [`Les présentes conditions régissent les ventes conclues sur le site ${site.name} entre ${company} et ses clients.`] },
      { heading: "Produits et prix", body: ["Les prix sont indiqués TTC dans la devise affichée. Le prix applicable est celui affiché au moment de la commande. Les visuels sont non contractuels."] },
      { heading: "Commande et paiement", body: ["La commande est confirmée après paiement en ligne sécurisé par Stripe. Aucune donnée bancaire n'est conservée par Ewo."] },
      { heading: "Personnalisation", body: ["En téléversant une image, vous garantissez en détenir les droits. Ewo se réserve le droit de refuser une image illicite, haineuse ou portant atteinte aux droits d'un tiers."] },
      { heading: "Livraison et retours", body: ["Voir les pages Livraison et Retours et remboursements."] },
      { heading: "Droit applicable", body: ["[À compléter selon le pays d'immatriculation de l'entreprise.]"] },
    ],
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    updated: "2 novembre 2026",
    sections: [
      { heading: "Données collectées", body: ["Lors d'une commande : nom, email, téléphone et informations nécessaires au paiement (traitées par Stripe). Lors de l'inscription à la newsletter : votre email. Lors d'un avis : le nom affiché et votre texte."] },
      { heading: "Utilisation", body: ["Ces données servent uniquement à traiter vos commandes, vous contacter au sujet de celles-ci et, si vous l'avez accepté, vous envoyer nos nouveautés."] },
      { heading: "Partenaires", body: ["Stripe (paiement), Printify (fabrication et expédition), Vercel (hébergement) et Supabase (stockage des avis et inscriptions)."] },
      { heading: "Stockage local", body: ["Votre panier, vos favoris et votre choix de thème sont enregistrés dans votre navigateur uniquement."] },
      { heading: "Vos droits", body: [`Vous pouvez demander l'accès, la correction ou la suppression de vos données. ${contactLine}`] },
    ],
  },
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    updated: "2 novembre 2026",
    sections: [
      { heading: "Éditeur", body: [`${company}, ${address}. [Numéro d'immatriculation à compléter.]`] },
      { heading: "Hébergement", body: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."] },
      { heading: "Contact", body: [contactLine] },
    ],
  },
];

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
