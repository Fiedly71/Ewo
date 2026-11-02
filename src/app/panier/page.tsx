import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Panier", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="page py-10">
      <h1 className="text-4xl font-bold tracking-tight">Votre panier</h1>
      <CartView />
    </div>
  );
}
