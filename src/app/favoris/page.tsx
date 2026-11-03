import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist-view";

export const metadata: Metadata = { title: "Mes favoris", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="page py-10">
      <h1 className="text-3xl md:text-[40px]">Mes favoris</h1>
      <p className="mt-2 text-muted">Vos coups de cœur, enregistrés sur cet appareil.</p>
      <WishlistView />
    </div>
  );
}
