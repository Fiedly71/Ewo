import type { Metadata } from "next";
import { Customizer } from "@/components/customizer";
import { DemoBanner } from "@/components/demo-banner";
import { getBaseVariants } from "@/lib/catalog";
import { customBases } from "@/lib/custom-bases";

export const metadata: Metadata = { title: "Personnaliser" };

export default async function CustomizePage() {
  const bases = await Promise.all(
    customBases.map(async (base) => ({
      slug: base.slug,
      title: base.title,
      price: base.price,
      variants: await getBaseVariants(base).catch(() => []),
    })),
  );
  return (
    <>
      <DemoBanner />
      <h1 className="text-3xl font-black">Personnaliser un vêtement</h1>
      <p className="mt-2 text-muted">Choisissez le vêtement, la couleur et la taille, puis ajoutez votre image.</p>
      <Customizer bases={bases.filter((b) => b.variants.length > 0)} />
    </>
  );
}
