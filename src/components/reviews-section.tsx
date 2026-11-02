import type { Review, ReviewSummary } from "@/lib/reviews";
import { ReviewForm } from "./review-form";
import { Stars } from "./stars";

export function ReviewsSection({ productId, reviews, summary }: { productId: string; reviews: Review[]; summary: ReviewSummary }) {
  return (
    <section id="avis" className="page mt-20 scroll-mt-28">
      <h2 className="text-2xl font-bold tracking-tight">Avis clients</h2>
      <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
        <div>
          {summary.count > 0 ? (
            <>
              <p className="text-5xl font-bold">{summary.average.toFixed(1)}</p>
              <Stars rating={summary.average} className="h-5 w-5" />
              <p className="mt-1 text-sm text-muted">Basé sur {summary.count} avis</p>
              <ul className="mt-5 space-y-1.5">
                {[5, 4, 3, 2, 1].map((n) => {
                  const c = summary.distribution[n - 1];
                  return (
                    <li key={n} className="flex items-center gap-2 text-xs text-muted">
                      <span className="w-3">{n}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <span className="block h-full bg-accent" style={{ width: `${(c / summary.count) * 100}%` }} />
                      </span>
                      <span className="w-6 text-right">{c}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">Aucun avis pour le moment. Soyez la première personne à donner le vôtre !</p>
          )}
          <div className="mt-6">
            <ReviewForm productId={productId} />
          </div>
        </div>
        {reviews.length > 0 && (
          <ul className="divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.id} className="py-5 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <Stars rating={r.rating} />
                  <time className="text-xs text-muted" dateTime={r.created_at}>
                    {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                </div>
                {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                <p className="mt-2 text-xs font-medium">{r.author}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
