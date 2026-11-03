import { z } from "zod";
import { getProductById } from "@/lib/catalog";
import { supabase, supabaseEnabled } from "@/lib/supabase";

const schema = z.object({
  productId: z.string().min(1).max(64),
  rating: z.number().int().min(1).max(5),
  author: z.string().trim().min(1).max(60),
  title: z.string().trim().max(120).optional().nullable(),
  body: z.string().trim().min(10, "Votre avis doit faire au moins 10 caractères.").max(2000),
  website: z.string().max(0).optional().nullable().or(z.literal("")),
});

/** Dépôt d'un avis : enregistré non approuvé, à valider dans Supabase avant publication. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message;
    return Response.json({ error: msg && !msg.startsWith("Invalid") && !msg.startsWith("Too") ? msg : "Avis incomplet ou invalide." }, { status: 400 });
  }
  const { productId, rating, author, title, body, website } = parsed.data;
  if (website) return Response.json({ ok: true });

  if (!(await getProductById(productId))) return Response.json({ error: "Produit introuvable." }, { status: 404 });
  if (!supabaseEnabled()) return Response.json({ ok: true, demo: true });

  try {
    await supabase("product_reviews", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ product_id: productId, rating, author, title: title || null, body }),
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Envoi impossible pour le moment." }, { status: 502 });
  }
}
