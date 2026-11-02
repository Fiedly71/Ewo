import type Stripe from "stripe";
import { config, stripeEnabled } from "@/lib/config";
import { getProductById } from "@/lib/catalog";
import { getCustomBase } from "@/lib/custom-bases";
import { stripe } from "@/lib/stripe";

type IncomingItem = {
  kind?: string;
  productId?: string;
  baseSlug?: string;
  variantId?: number;
  designUrl?: string;
  quantity?: number;
};

/**
 * Crée la session de paiement Stripe. Les prix sont recalculés côté serveur
 * (jamais repris du navigateur). Les infos Printify de chaque article sont
 * rangées dans les métadonnées du produit Stripe, relues par le webhook.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: IncomingItem[] } | null;
  const items = body?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 50)
    return Response.json({ error: "Panier vide ou invalide." }, { status: 400 });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)));
    const variantId = Number(item.variantId);

    if (item.kind === "collection" && typeof item.productId === "string") {
      const product = await getProductById(item.productId);
      const variant = product?.variants.find((v) => v.id === variantId && v.available);
      if (!product || !variant)
        return Response.json({ error: "Un article du panier n'est plus disponible." }, { status: 400 });
      const image = product.images.find((i) => i.variantIds.includes(variant.id)) ?? product.images[0];
      lineItems.push({
        quantity,
        price_data: {
          currency: config.currency,
          unit_amount: variant.price,
          product_data: {
            name: `${product.title} (${variant.title})`,
            images: image?.src.startsWith("https://") ? [image.src] : undefined,
            metadata: { kind: "collection", product_id: product.id, variant_id: String(variant.id) },
          },
        },
      });
    } else if (item.kind === "custom" && typeof item.baseSlug === "string") {
      const base = getCustomBase(item.baseSlug);
      const designUrl = String(item.designUrl ?? "");
      const validUrl =
        (designUrl.startsWith("https://") && designUrl.length <= 500) ||
        (designUrl.startsWith("data:image/") && !stripeEnabled()); // image locale du mode démo
      if (!base || !Number.isInteger(variantId) || !validUrl)
        return Response.json({ error: "Un article personnalisé est invalide, recréez-le." }, { status: 400 });
      lineItems.push({
        quantity,
        price_data: {
          currency: config.currency,
          unit_amount: base.price,
          product_data: {
            name: `${base.title} personnalisé`,
            metadata: {
              kind: "custom",
              blueprint_id: String(base.blueprintId),
              print_provider_id: String(base.printProviderId),
              variant_id: String(variantId),
              design_url: designUrl,
            },
          },
        },
      });
    } else {
      return Response.json({ error: "Article inconnu dans le panier." }, { status: 400 });
    }
  }

  if (!stripeEnabled()) return Response.json({ demo: true });

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true, // codes promo créés dans Stripe > Catalogue de produits > Coupons
    success_url: `${config.siteUrl}/commande/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.siteUrl}/panier`,
    locale: "fr",
  });
  return Response.json({ url: session.url });
}
