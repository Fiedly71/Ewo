"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductSnapshot } from "@/lib/product-utils";
import { ArrowRight, CloseIcon, SearchIcon } from "./icons";

/** Recherche prédictive : résultats instantanés pendant la saisie. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = (await res.json()) as { results?: ProductSnapshot[] };
        setResults(data.results ?? []);
      } catch {
        // requête annulée ou réseau indisponible
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query]);

  if (!open) return null;
  const q = query.trim();
  const shown = q.length >= 2 ? results : [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q) return;
    onClose();
    router.push(`/recherche?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Rechercher">
      <button type="button" aria-label="Fermer la recherche" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative border-b border-line bg-bg shadow-xl">
        <form onSubmit={submit} className="page flex items-center gap-3 py-5">
          <SearchIcon className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            name="q"
            placeholder="Rechercher un t-shirt, un sweat, une collection…"
            className="flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted"
            autoComplete="off"
          />
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </form>
        {q.length >= 2 && (
          <div className="page pb-6">
            {loading && shown.length === 0 && <p className="py-4 text-sm text-muted">Recherche…</p>}
            {!loading && shown.length === 0 && <p className="py-4 text-sm text-muted">Aucun produit pour « {q} ».</p>}
            {shown.length > 0 && (
              <>
                <p className="eyebrow mb-3">Produits</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {shown.map((p) => (
                    <li key={p.id}>
                      <Link href={`/produits/${p.id}`} onClick={onClose} className="flex items-center gap-4 p-2 hover:bg-surface">
                        <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface">
                          {p.image && <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />}
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{p.title}</span>
                          <span className="text-sm text-muted">{formatPrice(p.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button type="submit" onClick={submit} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
              Voir tous les résultats pour « {q} » <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
