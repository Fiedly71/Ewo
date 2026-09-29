export type ProductOption = {
  name: string;
  values: { id: number; title: string }[];
};

export type ProductVariant = {
  id: number;
  title: string;
  /** Prix en centimes. */
  price: number;
  available: boolean;
  optionIds: number[];
};

export type Product = {
  id: string;
  title: string;
  description: string;
  images: { src: string; variantIds: number[]; isDefault: boolean }[];
  options: ProductOption[];
  variants: ProductVariant[];
  tags: string[];
};

/** Vêtement vierge que le client peut personnaliser. */
export type CustomBase = {
  slug: string;
  title: string;
  blueprintId: number;
  printProviderId: number;
  /** Prix de vente en centimes. */
  price: number;
};

export type CustomBaseVariant = {
  id: number;
  title: string;
  color: string;
  size: string;
};

export type CartItem =
  | {
      kind: "collection";
      key: string;
      productId: string;
      variantId: number;
      title: string;
      variantTitle: string;
      image: string;
      price: number;
      quantity: number;
    }
  | {
      kind: "custom";
      key: string;
      baseSlug: string;
      variantId: number;
      title: string;
      variantTitle: string;
      /** URL publique de l'image téléversée sur Printify. */
      designUrl: string;
      price: number;
      quantity: number;
    };

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};
