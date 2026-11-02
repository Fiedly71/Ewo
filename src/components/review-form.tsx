"use client";

import { useState } from "react";
import { StarIcon } from "./icons";

export function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          author: form.get("author"),
          title: form.get("title"),
          body: form.get("body"),
          website: form.get("website"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; demo?: boolean };
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
      setMessage(
        data.demo
          ? "Merci ! (Mode démo : les avis seront enregistrés une fois la base de données connectée.)"
          : "Merci ! Votre avis sera publié après validation.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message ? err.message : "Envoi impossible, réessayez.");
    }
  }

  if (status === "done") return <p className="rounded-lg bg-surface p-4 text-sm">{message}</p>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-outline">
        Écrire un avis
      </button>
    );

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-line p-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Votre note</legend>
        <div className="flex text-accent" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} étoile${n > 1 ? "s" : ""}`} aria-pressed={rating === n} className="p-0.5">
              <StarIcon className="h-7 w-7" filled={(hover || rating) >= n} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Prénom ou pseudo</span>
          <input name="author" required maxLength={60} className="field" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Titre (facultatif)</span>
          <input name="title" maxLength={120} className="field" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Votre avis</span>
        <textarea name="body" required minLength={10} maxLength={2000} rows={4} className="field" />
      </label>
      {/* Champ piège anti-spam, invisible pour les humains. */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "loading"} className="btn btn-primary">
          {status === "loading" ? "Envoi…" : "Publier mon avis"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted underline underline-offset-4">
          Annuler
        </button>
      </div>
      {status === "error" && <p className="text-sm text-danger" role="alert">{message}</p>}
    </form>
  );
}
