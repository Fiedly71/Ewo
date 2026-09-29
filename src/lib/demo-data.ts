import type { CustomBaseVariant, Product } from "./types";

/** Données d'exemple affichées tant que Printify n'est pas configuré. */
const sizes = ["S", "M", "L", "XL"].map((title, i) => ({ id: 100 + i, title }));
const colors = [
  { id: 1, title: "Noir" },
  { id: 2, title: "Blanc" },
];

function demoProduct(id: string, title: string, description: string, price: number, image: string, tags: string[]): Product {
  const variants = colors.flatMap((c) =>
    sizes.map((s) => ({
      id: c.id * 1000 + s.id,
      title: `${c.title} / ${s.title}`,
      price,
      available: true,
      optionIds: [c.id, s.id],
    })),
  );
  return {
    id,
    title,
    description,
    tags,
    images: [{ src: image, variantIds: variants.map((v) => v.id), isDefault: true }],
    options: [
      { name: "Couleur", values: colors },
      { name: "Taille", values: sizes },
    ],
    variants,
  };
}

export const demoProducts: Product[] = [
  demoProduct("demo-1", "T-shirt Ewo Classique", "<p>Coton doux, logo Ewo brodé sur le cœur.</p>", 2400, "/demo/tshirt.svg", ["Essentiels"]),
  demoProduct("demo-2", "Sweat Ewo Signature", "<p>Sweat à capuche épais, grand logo dans le dos.</p>", 4900, "/demo/hoodie.svg", ["Essentiels"]),
  demoProduct("demo-3", "T-shirt Soleil", "<p>Illustration soleil couchant, impression pleine face.</p>", 2600, "/demo/tshirt-sun.svg", ["Été"]),
  demoProduct("demo-4", "Sweat Nuit", "<p>Motif étoilé, coupe ample.</p>", 5200, "/demo/hoodie-night.svg", ["Hiver"]),
];

export const demoBaseVariants: CustomBaseVariant[] = colors.flatMap((c) =>
  sizes.map((s) => ({ id: c.id * 1000 + s.id, title: `${c.title} / ${s.title}`, color: c.title, size: s.title })),
);
