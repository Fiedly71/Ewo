/** Réglages lus depuis les variables d'environnement (voir .env.example). */
export const config = {
  printifyToken: process.env.PRINTIFY_API_TOKEN ?? "",
  printifyShopId: process.env.PRINTIFY_SHOP_ID ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  currency: (process.env.NEXT_PUBLIC_CURRENCY ?? "usd").toLowerCase(),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Envoie la commande en production chez Printify dès le paiement reçu. */
  autoSendToProduction: process.env.PRINTIFY_AUTO_SEND_TO_PRODUCTION === "true",
};

export const printifyEnabled = () =>
  Boolean(config.printifyToken && config.printifyShopId);

export const stripeEnabled = () => Boolean(config.stripeSecretKey);
