import { slugify } from "./product-utils";
import type { CustomBaseVariant, Product } from "./types";

/** Données d'exemple affichées tant que Printify n'est pas configuré. */
const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL"];
const ONE_SIZE = ["Taille unique"];

function demoProduct(input: {
  id: string;
  title: string;
  description: string;
  price: number;
  colors: string[];
  sizes?: string[];
  tags: string[];
  daysAgo: number;
  /** Tailles en rupture, pour montrer l'affichage « indisponible ». */
  soldOut?: string[];
}): Product {
  const sizeList = (input.sizes ?? APPAREL_SIZES).map((title, i) => ({ id: 100 + i, title }));
  const colorList = input.colors.map((title, i) => ({ id: 1 + i, title }));
  const variants = colorList.flatMap((c) =>
    sizeList.map((s) => ({
      id: c.id * 1000 + s.id,
      title: `${c.title} / ${s.title}`,
      price: s.title === "2XL" ? input.price + 300 : input.price,
      available: !input.soldOut?.includes(`${c.title} / ${s.title}`),
      optionIds: [c.id, s.id],
    })),
  );
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    tags: input.tags,
    createdAt: new Date(Date.UTC(2026, 10, 2) - input.daysAgo * 86_400_000).toISOString(),
    images: colorList.map((c, i) => ({
      src: `/demo/${input.id}-${slugify(c.title)}.svg`,
      variantIds: variants.filter((v) => v.optionIds[0] === c.id).map((v) => v.id),
      isDefault: i === 0,
    })),
    options: [
      { name: "Couleur", values: colorList },
      { name: "Taille", values: sizeList },
    ],
    variants,
  };
}

export const demoProducts: Product[] = [
  demoProduct({
    id: "demo-1", title: "T-shirt Ewo Classique", price: 2400, colors: ["Noir", "Blanc", "Sable"], tags: ["Essentiels"], daysAgo: 60,
    description: "<p>Le t-shirt qui va avec tout. Coton doux peigné, coupe unisexe droite et logo Ewo imprimé sur le cœur.</p><ul><li>100 % coton peigné et filé à l'anneau</li><li>Grammage 150 g/m²</li><li>Coupe unisexe</li></ul>",
  }),
  demoProduct({
    id: "demo-2", title: "Sweat Ewo Signature", price: 4900, colors: ["Noir", "Gris chiné", "Marine"], tags: ["Essentiels"], daysAgo: 45,
    soldOut: ["Marine / S"],
    description: "<p>Sweat à capuche épais et chaud, poche kangourou et grand logo Ewo. Parfait pour les soirées fraîches.</p><ul><li>50 % coton, 50 % polyester</li><li>Intérieur molletonné</li><li>Capuche doublée avec cordon</li></ul>",
  }),
  demoProduct({
    id: "demo-3", title: "T-shirt Soleil", price: 2600, colors: ["Blanc", "Sable"], tags: ["Été"], daysAgo: 12,
    description: "<p>Un soleil couchant aux couleurs chaudes, imprimé pleine face. L'été, toute l'année.</p><ul><li>100 % coton</li><li>Impression DTG durable</li></ul>",
  }),
  demoProduct({
    id: "demo-4", title: "Sweat Nuit Étoilée", price: 5200, colors: ["Marine", "Noir"], tags: ["Hiver"], daysAgo: 20,
    description: "<p>Motif étoilé, coupe ample et matière épaisse pour les nuits d'hiver.</p><ul><li>50 % coton, 50 % polyester</li><li>Poche kangourou</li></ul>",
  }),
  demoProduct({
    id: "demo-5", title: "Casquette Ewo", price: 2200, colors: ["Noir", "Beige"], sizes: ONE_SIZE, tags: ["Accessoires"], daysAgo: 8,
    description: "<p>Casquette six panneaux brodée, sangle réglable à l'arrière.</p><ul><li>100 % coton sergé</li><li>Taille réglable</li></ul>",
  }),
  demoProduct({
    id: "demo-6", title: "Tote bag Ewo", price: 1800, colors: ["Naturel", "Noir"], sizes: ONE_SIZE, tags: ["Accessoires"], daysAgo: 30,
    description: "<p>Le sac du quotidien : toile solide, grandes anses, logo Ewo.</p><ul><li>100 % coton</li><li>38 × 42 cm</li></ul>",
  }),
  demoProduct({
    id: "demo-7", title: "T-shirt Vague", price: 2600, colors: ["Blanc", "Bleu ciel"], tags: ["Été"], daysAgo: 5,
    description: "<p>Des vagues et un soleil, pour garder la mer avec soi.</p><ul><li>100 % coton</li><li>Coupe unisexe</li></ul>",
  }),
  demoProduct({
    id: "demo-8", title: "T-shirt Palmier", price: 2600, colors: ["Vert olive", "Blanc"], tags: ["Été"], daysAgo: 3,
    soldOut: ["Vert olive / 2XL"],
    description: "<p>Un palmier minimaliste, imprimé au centre. Léger et respirant.</p><ul><li>100 % coton</li></ul>",
  }),
  demoProduct({
    id: "demo-9", title: "Sweat col rond Montagne", price: 4400, colors: ["Gris chiné", "Vert forêt"], tags: ["Hiver"], daysAgo: 15,
    description: "<p>Sweat col rond doux avec une illustration de sommets enneigés.</p><ul><li>50 % coton, 50 % polyester</li><li>Bords côtelés</li></ul>",
  }),
  demoProduct({
    id: "demo-10", title: "T-shirt manches longues Étoile", price: 3200, colors: ["Noir", "Blanc"], tags: ["Hiver"], daysAgo: 40,
    description: "<p>Manches longues, étoiles dorées et coupe confortable pour la mi-saison.</p><ul><li>100 % coton</li></ul>",
  }),
];

const baseColors = ["Noir", "Blanc", "Marine", "Gris chiné", "Sable"];
export const demoBaseVariants: CustomBaseVariant[] = baseColors.flatMap((color, ci) =>
  APPAREL_SIZES.map((size, si) => ({ id: (ci + 1) * 1000 + si, title: `${color} / ${size}`, color, size })),
);
