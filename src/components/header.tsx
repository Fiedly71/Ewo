"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./icons";
import { Logo } from "./logo";
import { SearchOverlay } from "./search-overlay";
import { useWishlist } from "./wishlist-provider";

type NavCollection = { slug: string; name: string; count: number };

const links = [
  { href: "/personnaliser", label: "Personnaliser" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "Aide" },
  { href: "/contact", label: "Contact" },
];

export function Header({ collections }: { collections: NavCollection[] }) {
  const { count, openDrawer, loaded } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const categoryLinks = [{ href: "/collections/tous", label: "Tous les produits" }, ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name }))];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="page relative flex h-[76px] items-center justify-between gap-4 md:h-[92px]">
          <div className="flex items-center gap-1 md:gap-10">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Menu" className="flex h-11 w-11 items-center justify-center text-fg md:hidden">
              <MenuIcon className="h-[22px] w-[22px]" />
            </button>
            <Logo />
          </div>

          <nav className="hidden flex-1 justify-center md:flex" aria-label="Navigation principale">
            <ul className="flex items-center gap-7 text-[15px]">
              <li className="group relative">
                <Link href="/collections" className="py-8 text-fg-soft hover:text-accent-deep hover:underline hover:underline-offset-4">
                  Boutique
                </Link>
                <div className="invisible absolute top-full left-1/2 z-30 w-60 -translate-x-1/2 border border-line bg-bg py-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {categoryLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="block px-5 py-2 text-fg-soft hover:text-fg hover:underline">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </li>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`hover:text-accent-deep hover:underline hover:underline-offset-4 ${pathname.startsWith(l.href) ? "text-fg underline underline-offset-4" : "text-fg-soft"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Rechercher" className="flex h-11 w-11 items-center justify-center text-fg">
              <SearchIcon className="h-[21px] w-[21px]" />
            </button>
            <Link href="/favoris" aria-label={`Favoris (${wishlist.items.length})`} className="relative hidden h-11 w-11 items-center justify-center text-fg md:flex">
              <HeartIcon className="h-[21px] w-[21px]" />
              {wishlist.items.length > 0 && <Badge>{wishlist.items.length}</Badge>}
            </Link>
            <button type="button" onClick={openDrawer} aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`} className="relative flex h-11 w-11 items-center justify-center text-fg">
              <BagIcon className="h-[22px] w-[22px]" />
              {loaded && count > 0 && <Badge>{count}</Badge>}
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-fg/40" />
          <nav className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-bg">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <Logo className="text-[26px]" />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer" className="flex h-11 w-11 items-center justify-center text-fg">
                <CloseIcon className="h-[22px] w-[22px]" />
              </button>
            </div>
            <ul className="py-3">
              {categoryLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block px-6 py-3 text-lg text-fg">{l.label}</Link>
                </li>
              ))}
            </ul>
            <ul className="border-t border-line py-3">
              {[...links, { href: "/favoris", label: `Favoris (${wishlist.items.length})` }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block px-6 py-3 text-fg">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-line bg-surface px-6 py-5">
              <Link href="/personnaliser" className="btn w-full">Créer mon vêtement</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-1.5 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] leading-none font-semibold text-white">
      {children}
    </span>
  );
}
