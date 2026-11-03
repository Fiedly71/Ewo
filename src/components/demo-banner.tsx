import { printifyEnabled } from "@/lib/config";

export function DemoBanner({ className = "" }: { className?: string }) {
  if (printifyEnabled()) return null;
  return (
    <p className={` border border-accent/30 bg-accent/10 px-4 py-2.5 text-center text-xs text-fg ${className}`}>
      <strong>Mode démo</strong> : Printify n&apos;est pas encore connecté, les produits affichés sont des exemples.
    </p>
  );
}
