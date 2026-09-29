"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { CustomBaseVariant } from "@/lib/types";
import { useCart } from "./cart-provider";

type Base = { slug: string; title: string; price: number; variants: CustomBaseVariant[] };

const SHAPES: Record<string, string> = {
  "t-shirt": "M60 40 L100 20 Q128 40 156 20 L196 40 L236 90 L200 115 L185 95 L185 240 L71 240 L71 95 L56 115 L20 90 Z",
  "sweat-capuche": "M60 50 L96 28 Q128 70 160 28 L196 50 L236 200 L204 208 L188 110 L188 244 L68 244 L68 110 L52 208 L20 200 Z",
};

const COLOR_HEX: Record<string, string> = {
  black: "#1d1d1f", noir: "#1d1d1f", white: "#ffffff", blanc: "#ffffff", navy: "#1f2a44",
  red: "#c0392b", "sport grey": "#9ea3a8", "athletic heather": "#b5b8bb", "dark grey": "#4a4a4a",
  "heather grey": "#b5b8bb", "military green": "#4b5320", maroon: "#6d1f2a", "royal": "#2a4bb3",
};

export function Customizer({ bases }: { bases: Base[] }) {
  const { add } = useCart();
  const [baseSlug, setBaseSlug] = useState(bases[0]?.slug ?? "");
  const base = bases.find((b) => b.slug === baseSlug);
  const colors = useMemo(() => [...new Set(base?.variants.map((v) => v.color))], [base]);
  const [color, setColor] = useState(colors[0] ?? "");
  const sizes = useMemo(() => base?.variants.filter((v) => v.color === color).map((v) => v.size) ?? [], [base, color]);
  const [size, setSize] = useState("");
  const [design, setDesign] = useState<{ url: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  if (!base) return <p className="mt-8">Aucun vêtement personnalisable n&apos;est disponible pour le moment.</p>;

  const activeColor = colors.includes(color) ? color : colors[0];
  const activeSize = sizes.includes(size) ? size : sizes[0];
  const variant = base.variants.find((v) => v.color === activeColor && v.size === activeSize);

  async function upload(file: File) {
    setError("");
    setAdded(false);
    if (!/^image\/(png|jpeg)$/.test(file.type)) return setError("Formats acceptés : PNG ou JPG.");
    if (file.size > 10 * 1024 * 1024) return setError("Image trop lourde (10 Mo maximum).");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDesign({ url: data.url, name: file.name });
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Le téléversement a échoué.");
    } finally {
      setUploading(false);
    }
  }

  function handleAdd() {
    if (!variant || !design || !base) return;
    add({
      kind: "custom",
      key: `p:${base.slug}:${variant.id}:${design.url}`,
      baseSlug: base.slug,
      variantId: variant.id,
      title: `${base.title} personnalisé`,
      variantTitle: `${variant.color} / ${variant.size}`,
      designUrl: design.url,
      price: base.price,
      quantity: 1,
    });
    setAdded(true);
  }

  const fill = COLOR_HEX[activeColor?.toLowerCase() ?? ""] ?? "#d9d4cc";

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-2">
      <svg viewBox="0 0 256 256" className="w-full rounded-2xl bg-black/5" role="img" aria-label="Aperçu du vêtement">
        <path d={SHAPES[base.slug] ?? SHAPES["t-shirt"]} fill={fill} stroke="#00000033" strokeWidth="2" />
        {design && <image href={design.url} x="88" y="80" width="80" height="100" preserveAspectRatio="xMidYMid meet" />}
        {!design && (
          <rect x="88" y="80" width="80" height="100" fill="none" stroke="#00000044" strokeDasharray="4 4" />
        )}
      </svg>

      <div className="space-y-6">
        <Choice label="Vêtement" values={bases.map((b) => b.slug)} labels={Object.fromEntries(bases.map((b) => [b.slug, b.title]))}
          value={base.slug} onChange={(v) => { setBaseSlug(v); setAdded(false); }} />
        <Choice label="Couleur" values={colors} value={activeColor} onChange={(v) => { setColor(v); setAdded(false); }} />
        <Choice label="Taille" values={sizes} value={activeSize} onChange={(v) => { setSize(v); setAdded(false); }} />

        <div>
          <p className="mb-2 text-sm font-semibold">Votre image (devant)</p>
          <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-black/20 p-6 text-sm hover:border-black">
            <input type="file" accept="image/png,image/jpeg" className="sr-only"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {uploading ? "Téléversement…" : design ? `✓ ${design.name} (changer)` : "Choisir une image PNG ou JPG"}
          </label>
          <p className="mt-2 text-xs text-black/50">Pour une impression nette, utilisez une image d&apos;au moins 2000 px de large.</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <p className="text-xl font-semibold">{formatPrice(base.price)}</p>
        <button type="button" onClick={handleAdd} disabled={!variant || !design || uploading}
          className="w-full rounded-full bg-black py-4 font-semibold text-white disabled:opacity-40">
          {added ? "Ajouté au panier ✓" : design ? "Ajouter au panier" : "Ajoutez d'abord une image"}
        </button>
      </div>
    </div>
  );
}

function Choice({ label, values, labels, value, onChange }: {
  label: string; values: string[]; labels?: Record<string, string>; value?: string; onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button key={v} type="button" onClick={() => onChange(v)}
            className={`rounded-full border px-4 py-2 text-sm ${value === v ? "border-black bg-black text-white" : "border-black/20 hover:border-black"}`}>
            {labels?.[v] ?? v}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
