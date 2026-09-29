import { printifyEnabled } from "@/lib/config";

export function DemoBanner() {
  if (printifyEnabled()) return null;
  return (
    <p className="mb-8 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg">
      Mode démo : Printify n&apos;est pas encore connecté, les produits affichés sont des exemples.
    </p>
  );
}
