"use client";

import { useMemo, useState } from "react";
import { colorHex } from "@/lib/colors";
import { formatPrice } from "@/lib/format";
import { compareSizes } from "@/lib/product-utils";
import type { CustomBaseVariant } from "@/lib/types";
import { useCart } from "./cart-provider";
import { ShieldIcon, SparkIcon, UploadIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";
import { SizeGuide } from "./size-guide";

type Base = { slug: string; title: string; price: number; variants: CustomBaseVariant[] };

const SHAPES: Record<string, string> = {
  "t-shirt": "M60 40 L100 20 Q128 40 156 20 L196 40 L236 90 L200 115 L185 95 L185 240 L71 240 L71 95 L56 115 L20 90 Z",
  "sweat-capuche": "M60 50 L96 28 Q128 70 160 28 L196 50 L236 200 L204 208 L188 110 L188 244 L68 244 L68 110 L52 208 L20 200 Z",
};

const MAX_BYTES = 10 * 1024 * 1024;

export function Customizer({ bases }: { bases: Base[] }) {
  const { add } = useCart();
  const [baseSlug, setBaseSlug] = useState(bases[0]?.slug ?? "");
  const base = bases.find((b) => b.slug === baseSlug);
  const colors = useMemo(() => [...new Set(base?.variants.map((v) => v.color))], [base]);
  const [color, setColor] = useState(colors[0] ?? "");
  const activeColor = colors.includes(color) ? color : colors[0];
  const sizes = useMemo(
    () => [...new Set(base?.variants.filter((v) => v.color === activeColor).map((v) => v.size))].sort(compareSizes),
    [base, activeColor],
  );
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [design, setDesign] = useState<{ url: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  if (!base) {
    return (
      <p className="mt-8 border border-line p-8 text-center text-muted">
        Aucun vêtement personnalisable n&apos;est disponible pour le moment. Revenez bientôt !
      </p>
    );
  }

  const activeSize = sizes.includes(size) ? size : sizes[0];
  const variant = base.variants.find((v) => v.color === activeColor && v.size === activeSize);

  async function upload(file: File) {
    setError("");
    if (!/^image\/(png|jpeg)$/.test(file.type)) return setError("Formats acceptés : PNG ou JPG.");
    if (file.size > MAX_BYTES) return setError("Image trop lourde (10 Mo maximum).");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error);
      setDesign({ url: data.url, name: file.name });
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Le téléversement a échoué, réessayez.");
    } finally {
      setUploading(false);
    }
  }

  function handleAdd() {
    if (!variant || !design || !base) return;
    add({
      kind: "custom",
      key: `p:${base.slug}:${variant.id}:${design.url.slice(0, 200)}`,
      baseSlug: base.slug,
      variantId: variant.id,
      title: `${base.title} personnalisé`,
      variantTitle: `${variant.color} / ${variant.size}`,
      designUrl: design.url,
      price: base.price,
      quantity,
    });
  }

  const fill = colorHex(activeColor);

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="md:sticky md:top-28 md:self-start">
        <div className="relative overflow-hidden bg-surface">
          <svg viewBox="0 0 256 256" className="w-full" role="img" aria-label={`Aperçu : ${base.title} ${activeColor}`}>
            <ellipse cx="128" cy="248" rx="80" ry="5" fill="#00000012" />
            <path d={SHAPES[base.slug] ?? SHAPES["t-shirt"]} fill={fill} stroke="#00000022" strokeWidth="2" className="transition-[fill] duration-300" />
            {design ? (
              <image href={design.url} x="88" y="80" width="80" height="100" preserveAspectRatio="xMidYMid meet" />
            ) : (
              <>
                <rect x="88" y="80" width="80" height="100" rx="4" fill="none" stroke="#f47a1f" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="128" y="134" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#888">Votre image ici</text>
              </>
            )}
          </svg>
          <span className="absolute top-4 left-4 rounded-full bg-bg/90 px-3 py-1 text-xs font-medium backdrop-blur">Aperçu</span>
        </div>
        <p className="mt-3 text-center text-xs text-muted">Aperçu indicatif : l&apos;image est imprimée au centre, sur le devant.</p>
      </div>

      <div>
        <p className="eyebrow">Personnalisation</p>
        <h1 className="mt-2 h-section">Créez votre vêtement</h1>
        <p className="mt-4 text-2xl">{formatPrice(base.price)}</p>
        <p className="mt-1 text-xs text-muted">Taxes incluses. Imprimé à la demande pour vous.</p>

        <div className="mt-8 space-y-7">
          <Step n={1} title="Vêtement">
            <div className="grid grid-cols-2 gap-3">
              {bases.map((b) => (
                <button key={b.slug} type="button" onClick={() => setBaseSlug(b.slug)} aria-pressed={b.slug === base.slug}
                  className={` border p-4 text-left text-sm transition ${b.slug === base.slug ? "border-fg ring-1 ring-fg" : "border-line hover:border-fg"}`}>
                  <span className="block font-medium">{b.title}</span>
                  <span className="text-muted">{formatPrice(b.price)}</span>
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title={`Couleur : ${activeColor ?? ""}`}>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} aria-label={c} aria-pressed={c === activeColor} title={c}
                  className={`h-10 w-10 rounded-full border border-line ring-offset-2 ring-offset-bg ${c === activeColor ? "ring-2 ring-fg" : "hover:ring-1 hover:ring-muted"}`}
                  style={{ background: colorHex(c) }} />
              ))}
            </div>
          </Step>

          <Step n={3} title="Taille" aside={<SizeGuide kind={base.slug === "sweat-capuche" ? "hoodie" : "tshirt"} />}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={s === activeSize}
                  className={`min-w-14 border px-4 py-2.5 text-sm ${s === activeSize ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>
                  {s}
                </button>
              ))}
            </div>
          </Step>

          <Step n={4} title="Votre image (devant)">
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) upload(file);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center text-sm transition ${dragging ? "border-accent bg-accent/5" : "border-line hover:border-fg"}`}
            >
              <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              <UploadIcon className="h-6 w-6 text-muted" />
              {uploading ? (
                <span className="font-medium">Téléversement…</span>
              ) : design ? (
                <span><span className="font-medium">✓ {design.name}</span><br /><span className="text-muted underline">Changer d&apos;image</span></span>
              ) : (
                <span><span className="font-medium">Glissez votre image ici</span> ou <span className="underline">parcourez</span><br /><span className="text-xs text-muted">PNG ou JPG, 10 Mo max.</span></span>
              )}
            </label>
            <p className="mt-2 text-xs text-muted">Pour une impression nette : au moins 2000 px de large, idéalement un PNG à fond transparent.</p>
            {error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}
          </Step>

          <div className="flex gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button type="button" onClick={handleAdd} disabled={!variant || !design || uploading} className="btn flex-1">
              {design ? `Ajouter au panier · ${formatPrice(base.price * quantity)}` : "Ajoutez d'abord une image"}
            </button>
          </div>

          <ul className="space-y-2 border-t border-line pt-6 text-sm text-muted">
            <li className="flex items-center gap-2"><SparkIcon className="h-4 w-4" /> Impression DTG durable, couleurs éclatantes</li>
            <li className="flex items-center gap-2"><ShieldIcon className="h-4 w-4" /> Paiement sécurisé, image vérifiée avant impression</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, aside, children }: { n: number; title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset>
      <div className="mb-3 flex items-center justify-between">
        <legend className="flex items-center gap-2 text-sm font-medium">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-fg text-[11px] font-bold text-bg">{n}</span>
          {title}
        </legend>
        {aside}
      </div>
      {children}
    </fieldset>
  );
}
