import { printifyEnabled } from "@/lib/config";
import { uploadImage } from "@/lib/printify";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Aucune image reçue." }, { status: 400 });
  if (!["image/png", "image/jpeg"].includes(file.type))
    return Response.json({ error: "Formats acceptés : PNG ou JPG." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Image trop lourde (10 Mo maximum)." }, { status: 400 });

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  if (!printifyEnabled()) {
    // Mode démo : l'image reste dans le navigateur, rien n'est envoyé à Printify.
    return Response.json({ url: `data:${file.type};base64,${base64}` });
  }

  try {
    const safeName = file.name.replace(/[^\w.-]/g, "_").slice(0, 80) || "design.png";
    const uploaded = await uploadImage(safeName, base64);
    return Response.json({ url: uploaded.preview_url });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Printify n'a pas accepté l'image, réessayez." }, { status: 502 });
  }
}
