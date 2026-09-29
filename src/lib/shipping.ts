import type { ShippingAddress } from "./types";

/**
 * Adresse de livraison prédéfinie : toutes les commandes sont expédiées par
 * Printify vers cette adresse. Le nom, l'email et le téléphone du client
 * (saisis au paiement) sont ajoutés pour identifier le colis.
 */
export function getPredefinedAddress(customer?: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}): ShippingAddress {
  const env = process.env;
  const [first, ...rest] = (customer?.name ?? "").trim().split(/\s+/);
  return {
    first_name: first || env.SHIP_TO_FIRST_NAME || "Ewo",
    last_name: rest.join(" ") || env.SHIP_TO_LAST_NAME || "Client",
    email: customer?.email || env.SHIP_TO_EMAIL || "",
    phone: customer?.phone || env.SHIP_TO_PHONE || "",
    country: env.SHIP_TO_COUNTRY || "US",
    region: env.SHIP_TO_REGION || "",
    address1: env.SHIP_TO_ADDRESS1 || "",
    address2: env.SHIP_TO_ADDRESS2 || "",
    city: env.SHIP_TO_CITY || "",
    zip: env.SHIP_TO_ZIP || "",
  };
}

export function isAddressConfigured() {
  const a = getPredefinedAddress();
  return Boolean(a.address1 && a.city && a.zip && a.country);
}
