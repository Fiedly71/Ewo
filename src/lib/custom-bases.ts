import type { CustomBase } from "./types";

/**
 * Vêtements vierges proposés à la personnalisation.
 * blueprintId et printProviderId viennent du catalogue Printify
 * (GET /v1/catalog/blueprints.json) : vérifiez-les avant la mise en ligne.
 */
export const customBases: CustomBase[] = [
  {
    slug: "t-shirt",
    title: "T-shirt unisexe",
    blueprintId: Number(process.env.CUSTOM_TSHIRT_BLUEPRINT_ID ?? 12),
    printProviderId: Number(process.env.CUSTOM_TSHIRT_PROVIDER_ID ?? 29),
    price: Number(process.env.CUSTOM_TSHIRT_PRICE ?? 2500),
  },
  {
    slug: "sweat-capuche",
    title: "Sweat à capuche unisexe",
    blueprintId: Number(process.env.CUSTOM_HOODIE_BLUEPRINT_ID ?? 77),
    printProviderId: Number(process.env.CUSTOM_HOODIE_PROVIDER_ID ?? 29),
    price: Number(process.env.CUSTOM_HOODIE_PRICE ?? 4500),
  },
];

export const getCustomBase = (slug: string) => customBases.find((b) => b.slug === slug);
