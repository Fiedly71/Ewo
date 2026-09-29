"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/collections", label: "Collections" },
  { href: "/personnaliser", label: "Personnaliser" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight" onClick={() => setOpen(false)}>
          EW<span className="text-accent">O</span>
        </Link>
        <div className="hidden flex-1 justify-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "text-accent" : "text-muted hover:text-fg"}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <Link href="/panier" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg">
            Panier ({count})
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-line px-4 pb-6 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-lg ${pathname === l.href ? "text-accent" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/personnaliser"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-accent py-3 text-center font-semibold text-accent-fg"
          >
            Créer mon vêtement
          </Link>
        </div>
      )}
    </header>
  );
}
