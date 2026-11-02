import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Customizer } from "@/components/customizer";
import { DemoBanner } from "@/components/demo-banner";
import { getBaseVariants } from "@/lib/catalog";
import { customBases } from "@/lib/custom-bases";

export const metadata: Metadata = {
  title: "Personnaliser un vêtement",
  description: "Ajoutez votre image sur un t-shirt ou un sweat à capuche, choisissez la couleur et la taille. Imprimé à la demande.",
  alternates: { canonical: "/personnaliser" },
};

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
    <div className="page py-6 md:py-10">
      <Breadcrumbs items={[{ href: "/", label: "Accueil" }, { label: "Personnaliser" }]} />
      <DemoBanner className="mt-4" />
      <div className="mt-6">
        <Customizer bases={bases.filter((b) => b.variants.length > 0)} />
      </div>
    </div>
  );
}
