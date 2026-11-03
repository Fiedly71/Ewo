import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page py-24 text-center">
      <p className="text-8xl font-normal text-accent">404</p>
      <h1 className="mt-4 text-3xl">Page introuvable</h1>
      <p className="mt-3 text-muted">Cette page n&apos;existe pas ou plus. Le produit a peut-être été retiré.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn">Retour à l&apos;accueil</Link>
        <Link href="/collections/tous" className="btn btn-outline">Voir la boutique</Link>
      </div>
    </div>
  );
}
