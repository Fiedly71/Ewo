import type Stripe from "stripe";
import { config, printifyEnabled } from "@/lib/config";
import { createOrder, type OrderLineItem } from "@/lib/printify";
import { getPredefinedAddress, isAddressConfigured } from "@/lib/shipping";
import { stripe } from "@/lib/stripe";

/** Quand un paiement Stripe aboutit, la commande est créée chez Printify. */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !config.stripeWebhookSecret) return new Response("Webhook non configuré", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, config.stripeWebhookSecret);
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded")
    return new Response("ignoré");

  const session = await stripe().checkout.sessions.retrieve(event.data.object.id, {
    expand: ["line_items.data.price.product"],
  });
  if (session.payment_status !== "paid") return new Response("paiement en attente");

  if (!printifyEnabled() || !isAddressConfigured()) {
    // Réponse en erreur pour que Stripe renvoie l'événement une fois la configuration corrigée.
    console.error(`Commande ${session.id} payée mais Printify ou l'adresse de livraison n'est pas configuré.`);
    return new Response("Printify non configuré", { status: 500 });
  }

  const lineItems: OrderLineItem[] = [];
  for (const li of session.line_items?.data ?? []) {
    const meta = (li.price?.product as Stripe.Product | undefined)?.metadata ?? {};
    const quantity = li.quantity ?? 1;
    if (meta.kind === "collection") {
      lineItems.push({ product_id: meta.product_id, variant_id: Number(meta.variant_id), quantity });
    } else if (meta.kind === "custom") {
      lineItems.push({
        blueprint_id: Number(meta.blueprint_id),
        print_provider_id: Number(meta.print_provider_id),
        variant_id: Number(meta.variant_id),
        print_areas: { front: meta.design_url },
        quantity,
      });
    }
  }

  try {
    const order = await createOrder({
      externalId: session.id,
      lineItems,
      address: getPredefinedAddress(session.customer_details ?? undefined),
    });
    console.log(`Commande Printify ${order.id} créée pour ${session.id}`);
  } catch (e) {
    console.error(e);
    return new Response("Échec de la création de la commande Printify", { status: 500 });
  }
  return new Response("ok");
}
