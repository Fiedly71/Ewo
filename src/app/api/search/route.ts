import { searchProducts } from "@/lib/catalog";
import { toSnapshot } from "@/lib/product-utils";

/** Recherche prédictive : renvoie au plus 6 produits. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return Response.json({ results: [] });
  try {
    const results = (await searchProducts(q)).slice(0, 6).map(toSnapshot);
    return Response.json({ results }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (e) {
    console.error(e);
    return Response.json({ results: [], error: "Recherche indisponible." }, { status: 502 });
  }
}
