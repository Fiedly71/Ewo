import Link from "next/link";
import { activeCount, applyFilters, facetsFor, PAGE_SIZE, parseFilters } from "@/lib/filters";
import type { Product } from "@/lib/types";
import { type ActiveFilters, FiltersPanel, MobileFilters, SortSelect } from "./collection-filters";
import { CloseIcon } from "./icons";
import { ProductCard } from "./product-card";

type SP = Record<string, string | string[] | undefined>;

/** Grille produits avec filtres, tri, puces de filtres actifs et pagination (paramètres d'URL). */
export function ProductListing({ products, searchParams, basePath }: { products: Product[]; searchParams: SP; basePath: string }) {
  const { page, ...active } = parseFilters(searchParams);
  const facets = facetsFor(products);
  const filtered = applyFilters(products, active);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const count = activeCount(active);

  const href = (patch: Partial<ActiveFilters> & { page?: number }) => {
    const next = { ...active, ...patch };
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    next.sizes.forEach((s) => p.append("taille", s));
    next.colors.forEach((c) => p.append("couleur", c));
    if (next.min) p.set("prix_min", next.min);
    if (next.max) p.set("prix_max", next.max);
    if (next.available) p.set("dispo", "1");
    if (next.sort) p.set("tri", next.sort);
    if (patch.page && patch.page > 1) p.set("page", String(patch.page));
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const chips = [
    ...active.sizes.map((s) => ({ label: `Taille : ${s}`, href: href({ sizes: active.sizes.filter((x) => x !== s) }) })),
    ...active.colors.map((c) => ({ label: c, href: href({ colors: active.colors.filter((x) => x !== c) }) })),
    ...(active.min || active.max ? [{ label: `Prix : ${active.min || "0"} – ${active.max || "∞"}`, href: href({ min: "", max: "" }) }] : []),
    ...(active.available ? [{ label: "En stock", href: href({ available: false }) }] : []),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <FiltersPanel facets={facets} active={active} idPrefix="d" />
        </div>
      </aside>
      <div>
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <MobileFilters facets={facets} active={active} activeCount={count} />
            <p className="text-sm whitespace-nowrap text-muted">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <SortSelect active={active} />
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <Link key={c.label} href={c.href} scroll={false} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:border-fg">
                {c.label} <CloseIcon className="h-3 w-3" />
              </Link>
            ))}
            <Link href={href({ sizes: [], colors: [], min: "", max: "", available: false })} scroll={false} className="text-xs underline underline-offset-4">
              Tout effacer
            </Link>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold">Aucun produit ne correspond</p>
            <p className="mt-2 text-sm text-muted">Essayez d&apos;enlever un filtre.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href({ page: n })}
                aria-current={n === current ? "page" : undefined}
                className={`grid h-10 w-10 place-items-center rounded-lg text-sm ${n === current ? "bg-fg text-bg" : "border border-line hover:border-fg"}`}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
