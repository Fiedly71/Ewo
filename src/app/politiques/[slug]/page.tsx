import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/lib/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/politiques/[slug]">): Promise<Metadata> {
  const policy = getPolicy((await params).slug);
  return policy ? { title: policy.title, alternates: { canonical: `/politiques/${policy.slug}` } } : { title: "Page introuvable" };
}

export default async function PolicyPage({ params }: PageProps<"/politiques/[slug]">) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();
  return (
    <div className="page grid gap-10 py-10 md:grid-cols-[220px_1fr]">
      <nav aria-label="Pages d'information" className="order-last md:order-first">
        <p className="eyebrow mb-3">Informations</p>
        <ul className="space-y-2 text-sm">
          {policies.map((p) => (
            <li key={p.slug}>
              <Link href={`/politiques/${p.slug}`} aria-current={p.slug === policy.slug ? "page" : undefined}
                className={p.slug === policy.slug ? "font-semibold" : "text-muted hover:text-fg"}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="max-w-2xl">
        <h1 className="text-3xl md:text-[40px]">{policy.title}</h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : {policy.updated}</p>
        {policy.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-lg font-semibold">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">{p}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
