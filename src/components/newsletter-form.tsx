"use client";

import { useState } from "react";
import { ArrowRight } from "./icons";

export function NewsletterForm({ source = "footer", dark }: { source?: string; dark?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website"), source }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
      setMessage("Merci ! Vous êtes bien inscrit·e.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message ? err.message : "Inscription impossible, réessayez.");
    }
  }

  if (status === "done") return <p className="text-sm font-medium">{message}</p>;
  return (
    <form onSubmit={submit} className="w-full">
      <div className={`flex items-center rounded-lg border ${dark ? "border-white/30" : "border-line bg-bg"} focus-within:border-current`}>
        <label htmlFor={`nl-${source}`} className="sr-only">Adresse email</label>
        <input
          id={`nl-${source}`}
          name="email"
          type="email"
          required
          placeholder="Votre adresse email"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:opacity-60"
        />
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={status === "loading"} aria-label="S'inscrire" className="grid h-11 w-11 place-items-center disabled:opacity-40">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-sm text-danger" role="alert">{message}</p>}
    </form>
  );
}
