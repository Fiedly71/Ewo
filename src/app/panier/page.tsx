import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Panier" };

export default function CartPage() {
  return (
    <>
      <h1 className="text-3xl font-black">Panier</h1>
      <CartView />
    </>
  );
}
