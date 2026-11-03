"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { colorHex } from "@/lib/colors";
import { CloseIcon, FilterIcon } from "./icons";

export type Facets = {
  sizes: { value: string; count: number }[];
  colors: { value: string; count: number }[];
};
export type ActiveFilters = { sizes: string[]; colors: string[]; min: string; max: string; available: boolean; sort: string; q?: string };

export const SORTS = [
  { value: "", label: "En vedette" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "az", label: "Alphabétique, A à Z" },
];

function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  function go(params: URLSearchParams) {
    params.delete("page");
    for (const [k, v] of [...params.entries()]) if (!v) params.delete(k);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }
  return { go, pending };
}

function paramsFrom(active: ActiveFilters) {
  const p = new URLSearchParams();
  if (active.q) p.set("q", active.q);
  active.sizes.forEach((s) => p.append("taille", s));
  active.colors.forEach((c) => p.append("couleur", c));
  if (active.min) p.set("prix_min", active.min);
  if (active.max) p.set("prix_max", active.max);
  if (active.available) p.set("dispo", "1");
  if (active.sort) p.set("tri", active.sort);
  return p;
}

export function SortSelect({ active }: { active: ActiveFilters }) {
  const { go, pending } = useFilterNavigation();
  return (
    <label className={`flex items-center gap-2 text-sm ${pending ? "opacity-60" : ""}`}>
      <span className="hidden text-muted sm:inline">Trier par</span>
      <select
        value={active.sort}
        onChange={(e) => go(paramsFrom({ ...active, sort: e.target.value }))}
        className="max-w-[9.5rem] border border-line-strong bg-bg px-3 py-2 text-sm outline-none focus:border-fg sm:max-w-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </label>
  );
}

export function FiltersPanel({ facets, active, idPrefix = "f" }: { facets: Facets; active: ActiveFilters; idPrefix?: string }) {
  const { go, pending } = useFilterNavigation();
  const [min, setMin] = useState(active.min);
  const [max, setMax] = useState(active.max);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resynchronise après navigation
    setMin(active.min);
    setMax(active.max);
  }, [active.min, active.max]);

  const toggle = (key: "sizes" | "colors", value: string) => {
    const list = active[key].includes(value) ? active[key].filter((v) => v !== value) : [...active[key], value];
    go(paramsFrom({ ...active, [key]: list }));
  };

  return (
    <div className={`space-y-8 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <label className="flex cursor-pointer items-center justify-between text-sm">
        <span className="font-medium">En stock uniquement</span>
        <input
          type="checkbox"
          checked={active.available}
          onChange={(e) => go(paramsFrom({ ...active, available: e.target.checked }))}
          className="h-4 w-4 accent-[var(--fg)]"
        />
      </label>

      {facets.sizes.length > 1 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Taille</legend>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const on = active.sizes.includes(s.value);
              return (
                <button key={s.value} type="button" aria-pressed={on} onClick={() => toggle("sizes", s.value)}
                  className={`min-w-12 border px-3 py-2 text-sm ${on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}>
                  {s.value}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {facets.colors.length > 1 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Couleur</legend>
          <ul className="space-y-2">
            {facets.colors.map((c) => {
              const on = active.colors.includes(c.value);
              return (
                <li key={c.value}>
                  <button type="button" aria-pressed={on} onClick={() => toggle("colors", c.value)} className="flex w-full items-center gap-3 text-sm">
                    <span className={`h-6 w-6 rounded-full border border-line ring-offset-2 ring-offset-bg ${on ? "ring-2 ring-fg" : ""}`} style={{ background: colorHex(c.value) }} />
                    <span className={on ? "font-semibold" : ""}>{c.value}</span>
                    <span className="ml-auto text-xs text-muted">{c.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-medium">Prix</legend>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go(paramsFrom({ ...active, min, max }));
          }}
        >
          <label className="sr-only" htmlFor={`${idPrefix}-min`}>Prix minimum</label>
          <input id={`${idPrefix}-min`} inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d]/g, ""))} className="field py-2" />
          <span className="text-muted">–</span>
          <label className="sr-only" htmlFor={`${idPrefix}-max`}>Prix maximum</label>
          <input id={`${idPrefix}-max`} inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d]/g, ""))} className="field py-2" />
          <button type="submit" className="btn btn-outline px-3 py-2">OK</button>
        </form>
      </fieldset>
    </div>
  );
}

export function MobileFilters({ facets, active, activeCount }: { facets: Facets; active: ActiveFilters; activeCount: number }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 border border-line px-3 py-2 text-sm lg:hidden">
        <FilterIcon /> Filtres {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-fg px-1 text-[11px] text-bg">{activeCount}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-bg shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <p className="text-lg font-semibold">Filtres</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FiltersPanel facets={facets} active={active} idPrefix="m" />
            </div>
            <div className="border-t border-line p-5">
              <button type="button" onClick={() => setOpen(false)} className="btn w-full">Voir les résultats</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
