import { z } from "zod";
import { supabase, supabaseEnabled } from "@/lib/supabase";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().max(40).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

/** Inscription à la newsletter, enregistrée dans Supabase (table newsletter_subscribers). */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Adresse email invalide." }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true }); // robot : on ignore sans le dire

  if (!supabaseEnabled()) return Response.json({ ok: true, demo: true });

  try {
    await supabase("newsletter_subscribers?on_conflict=email", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ email: parsed.data.email, source: parsed.data.source ?? null }),
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Inscription impossible pour le moment." }, { status: 502 });
  }
}
