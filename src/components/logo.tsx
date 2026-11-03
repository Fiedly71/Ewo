import Link from "next/link";

/** Logo texte Ewo (à remplacer par /logo.png quand le fichier existe). */
export function Logo({ className = "text-[30px] md:text-[36px]" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Ewo, accueil" className={`shrink-0 leading-none font-bold tracking-[0.06em] text-fg ${className}`}>
      EW<span className="text-accent">O</span>
    </Link>
  );
}
