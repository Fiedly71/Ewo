"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight">
          EWO
        </Link>
        <div className="flex flex-1 gap-5 text-sm font-medium">
          <Link href="/collections" className="hover:underline">
            Collections
          </Link>
          <Link href="/personnaliser" className="hover:underline">
            Personnaliser
          </Link>
        </div>
        <Link href="/panier" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          Panier ({count})
        </Link>
      </nav>
    </header>
  );
}
