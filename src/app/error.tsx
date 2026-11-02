"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="page py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Oups, un problème est survenu</h1>
      <p className="mt-3 text-muted">La boutique n&apos;a pas pu charger cette page. Réessayez dans un instant.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">Réessayer</button>
        <Link href="/" className="btn btn-outline">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
