import { printifyEnabled } from "@/lib/config";

export function DemoBanner() {
  if (printifyEnabled()) return null;
  return (
    <p className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Mode démo : Printify n&apos;est pas encore connecté, les produits affichés sont des exemples.
    </p>
  );
}
