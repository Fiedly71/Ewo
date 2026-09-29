/** Numéro WhatsApp au format international, chiffres seulement. */
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP ?? "50947012465").replace(/\D/g, "");

export const whatsappDisplay = "+509 47 01 2465";

export function whatsappLink(message = "Bonjour Ewo, j'ai une question sur une commande.") {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
