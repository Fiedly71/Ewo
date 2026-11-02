import type { Metadata } from "next";
import Form from "next/form";
import { SearchIcon } from "@/components/icons";
import { ProductListing } from "@/components/product-listing";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Recherche", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/recherche">) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 100) ?? "";
  const results = q ? await searchProducts(q) : [];
  return (
    <div className="page py-10">
      <h1 className="text-center text-4xl font-bold tracking-tight">Recherche</h1>
      <Form action="/recherche" className="mx-auto mt-6 flex max-w-xl items-center rounded-lg border border-line focus-within:border-fg">
        <input name="q" defaultValue={q} type="search" placeholder="Rechercher un produit" aria-label="Rechercher un produit" className="flex-1 bg-transparent px-4 py-3 outline-none" />
        <button type="submit" aria-label="Rechercher" className="grid h-12 w-12 place-items-center">
          <SearchIcon />
        </button>
      </Form>
      {q && (
        <p className="mt-6 text-center text-sm text-muted">
          {results.length} résultat{results.length > 1 ? "s" : ""} pour « {q} »
        </p>
      )}
      <div className="mt-10">
        {q && results.length > 0 && <ProductListing products={results} searchParams={sp} basePath="/recherche" />}
      </div>
    </div>
  );
}
