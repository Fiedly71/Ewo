"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import { BagIcon, ChevronDown, ChevronRight, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./icons";
import { SearchOverlay } from "./search-overlay";
import { ThemeToggle } from "./theme-toggle";
import { useWishlist } from "./wishlist-provider";

type NavCollection = { slug: string; name: string; count: number };

export function Header({ collections }: { collections: NavCollection[] }) {
  const { count, openDrawer, loaded } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const links = [
    { href: "/collections/tous?tri=nouveautes", match: "/collections/tous", label: "Nouveautés" },
    { href: "/personnaliser", match: "/personnaliser", label: "Personnaliser" },
    { href: "/a-propos", match: "/a-propos", label: "À propos" },
    { href: "/contact", match: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 border-b bg-bg/95 backdrop-blur transition-colors ${scrolled ? "border-line" : "border-transparent"}`}>
        <div className="page flex h-16 items-center gap-2 md:h-20">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-surface lg:hidden"
          >
            <MenuIcon />
          </button>

          <Link href="/" className="text-2xl font-black tracking-tight lg:mr-10" aria-label="Ewo, accueil">
            EW<span className="text-accent">O</span>
          </Link>

          <nav className="hidden flex-1 items-center gap-8 text-sm font-medium lg:flex" aria-label="Navigation principale">
            <div className="group relative">
              <Link
                href="/collections"
                className={`flex items-center gap-1 py-7 ${isActive("/collections") && !pathname.startsWith("/collections/tous") ? "text-fg underline underline-offset-8" : "text-fg/80 hover:text-fg"}`}
              >
                Boutique <ChevronDown />
              </Link>
              <div className="invisible absolute top-full left-0 w-64 translate-y-1 rounded-lg border border-line bg-bg p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link href="/collections/tous" className="flex justify-between rounded-md px-3 py-2.5 hover:bg-surface">
                  Tous les produits
                </Link>
                {collections.map((c) => (
                  <Link key={c.slug} href={`/collections/${c.slug}`} className="flex justify-between rounded-md px-3 py-2.5 hover:bg-surface">
                    {c.name} <span className="text-muted">{c.count}</span>
                  </Link>
                ))}
                <div className="my-2 border-t border-line" />
                <Link href="/personnaliser" className="block rounded-md px-3 py-2.5 font-semibold text-accent hover:bg-surface">
                  Créer mon vêtement →
                </Link>
              </div>
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={isActive(l.match) ? "text-fg underline underline-offset-8" : "text-fg/80 hover:text-fg"}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Rechercher" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <SearchIcon />
            </button>
            <ThemeToggle className="hidden sm:grid" />
            <Link href="/favoris" aria-label={`Favoris (${wishlist.items.length})`} className="relative hidden h-10 w-10 place-items-center rounded-full hover:bg-surface sm:grid">
              <HeartIcon />
              {wishlist.items.length > 0 && <Badge>{wishlist.items.length}</Badge>}
            </Link>
            <button type="button" onClick={openDrawer} aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`} className="relative -mr-2 grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <BagIcon />
              {loaded && count > 0 && <Badge>{count}</Badge>}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />

      {/* Menu mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "visible" : "pointer-events-none invisible transition-[visibility] delay-300"}`} aria-hidden={!menuOpen}>
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-bg shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Menu mobile"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="text-xl font-black">EW<span className="text-accent">O</span></span>
            <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <p className="eyebrow px-2 pt-2 pb-1">Boutique</p>
            {[{ slug: "tous", name: "Tous les produits" }, ...collections].map((c) => (
              <MobileLink key={c.slug} href={`/collections/${c.slug}`} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
                {c.name}
              </MobileLink>
            ))}
            <p className="eyebrow mt-4 px-2 pt-2 pb-1">Ewo</p>
            {[...links, { href: "/favoris", match: "/favoris", label: `Favoris (${wishlist.items.length})` }, { href: "/faq", match: "/faq", label: "FAQ" }].map((l) => (
              <MobileLink key={l.href} href={l.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
                {l.label}
              </MobileLink>
            ))}
          </div>
          <div className="space-y-3 border-t border-line p-4">
            <Link href="/personnaliser" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} className="btn btn-accent w-full">
              Créer mon vêtement
            </Link>
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Thème clair / sombre</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-0.5 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg">
      {children}
    </span>
  );
}

function MobileLink({ href, children, onClick, tabIndex }: { href: string; children: React.ReactNode; onClick: () => void; tabIndex: number }) {
  return (
    <Link href={href} onClick={onClick} tabIndex={tabIndex} className="flex items-center justify-between rounded-md px-2 py-3 text-lg hover:bg-surface">
      {children} <ChevronRight className="h-4 w-4 text-muted" />
    </Link>
  );
}
