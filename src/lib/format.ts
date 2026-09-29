const currency = (process.env.NEXT_PUBLIC_CURRENCY ?? "usd").toUpperCase();

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    cents / 100,
  );
}
