import "server-only";
import Stripe from "stripe";
import { config } from "./config";

let client: Stripe | null = null;

export function stripe() {
  client ??= new Stripe(config.stripeSecretKey);
  return client;
}
