import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";

export const metadata: Metadata = { title: "Merci" };

export default async function ThanksPage({ searchParams }: PageProps<"/commande/merci">) {
  const { demo } = await searchParams;
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <ClearCart />
      <h1 className="text-3xl font-black">Merci pour votre commande !</h1>
      <p className="mt-4 text-black/60">
        {demo
          ? "Mode démo : aucun paiement n'a été pris et aucune commande n'a été envoyée à Printify."
          : "Votre paiement est confirmé. Votre commande part en impression chez Printify, vous recevrez un email de confirmation."}
      </p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
