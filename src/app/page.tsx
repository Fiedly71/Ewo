import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/catalog";

export default async function Home() {
  const products = (await getProducts()).slice(0, 4);
  return (
    <>
      <DemoBanner />
      <section className="grid gap-8 rounded-3xl bg-black px-8 py-14 text-white md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Vos vêtements, <span className="text-accent">votre style.</span>
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Ajoutez votre image sur un t-shirt ou un sweat, ou choisissez une pièce dans nos collections.
            Chaque commande est imprimée à la demande.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/personnaliser" className="rounded-full bg-accent px-6 py-3 font-semibold text-black">
              Personnaliser un vêtement
            </Link>
            <Link href="/collections" className="rounded-full border border-white/30 px-6 py-3 font-semibold">
              Voir les collections
            </Link>
          </div>
        </div>
        <ol className="grid gap-3 text-sm text-white/80">
          {["Choisissez un vêtement", "Ajoutez votre design ou prenez un modèle", "Payez en ligne, on s'occupe du reste"].map(
            (step, i) => (
              <li key={step} className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-bold text-black">{i + 1}</span>
                {step}
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Nouveautés</h2>
          <Link href="/collections" className="text-sm font-medium hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
