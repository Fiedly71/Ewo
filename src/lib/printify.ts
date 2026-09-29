import "server-only";
import { config } from "./config";
import type { CustomBaseVariant, Product, ShippingAddress } from "./types";

const API = "https://api.printify.com/v1";

async function printify<T>(path: string, init?: RequestInit & { revalidate?: number }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.printifyToken}`,
      "Content-Type": "application/json",
      "User-Agent": "Ewo",
      ...init?.headers,
    },
    next: init?.method && init.method !== "GET" ? undefined : { revalidate: init?.revalidate ?? 300 },
  });
  if (!res.ok) {
    throw new Error(`Printify ${res.status} sur ${path}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

type RawProduct = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visible: boolean;
  images: { src: string; variant_ids: number[]; is_default: boolean }[];
  options: { name: string; values: { id: number; title: string }[] }[];
  variants: {
    id: number;
    title: string;
    price: number;
    is_enabled: boolean;
    is_available: boolean;
    options: number[];
  }[];
};

function toProduct(p: RawProduct): Product {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tags: p.tags ?? [],
    images: p.images.map((i) => ({ src: i.src, variantIds: i.variant_ids, isDefault: i.is_default })),
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
    variants: p.variants
      .filter((v) => v.is_enabled)
      .map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        available: v.is_available,
        optionIds: v.options,
      })),
  };
}

export async function listProducts(): Promise<Product[]> {
  const products: Product[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await printify<{ data: RawProduct[]; last_page: number }>(
      `/shops/${config.printifyShopId}/products.json?limit=50&page=${page}`,
    );
    products.push(...res.data.filter((p) => p.visible !== false).map(toProduct));
    if (page >= res.last_page) break;
  }
  return products;
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return toProduct(await printify<RawProduct>(`/shops/${config.printifyShopId}/products/${encodeURIComponent(id)}.json`));
  } catch {
    return null;
  }
}

export async function getBlueprintVariants(blueprintId: number, printProviderId: number): Promise<CustomBaseVariant[]> {
  const res = await printify<{ variants: { id: number; title: string; options: Record<string, string> }[] }>(
    `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
    { revalidate: 86400 },
  );
  return res.variants.map((v) => ({
    id: v.id,
    title: v.title,
    color: v.options.color ?? "",
    size: v.options.size ?? "",
  }));
}

export async function uploadImage(fileName: string, base64: string) {
  return printify<{ id: string; preview_url: string; width: number; height: number }>(
    "/uploads/images.json",
    { method: "POST", body: JSON.stringify({ file_name: fileName, contents: base64 }) },
  );
}

export type OrderLineItem =
  | { product_id: string; variant_id: number; quantity: number }
  | {
      blueprint_id: number;
      print_provider_id: number;
      variant_id: number;
      print_areas: { front: string };
      quantity: number;
    };

export async function createOrder(input: {
  externalId: string;
  lineItems: OrderLineItem[];
  address: ShippingAddress;
}) {
  const order = await printify<{ id: string }>(`/shops/${config.printifyShopId}/orders.json`, {
    method: "POST",
    body: JSON.stringify({
      external_id: input.externalId,
      label: input.externalId,
      line_items: input.lineItems,
      shipping_method: 1,
      send_shipping_notification: false,
      address_to: input.address,
    }),
  });
  if (config.autoSendToProduction) {
    await printify(`/shops/${config.printifyShopId}/orders/${order.id}/send_to_production.json`, {
      method: "POST",
    });
  }
  return order;
}
