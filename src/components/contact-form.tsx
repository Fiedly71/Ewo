"use client";

import { whatsappLink } from "@/lib/contact";

const subjects = ["Question sur un produit", "Suivi de commande", "Commande en grande quantité", "Problème avec un article", "Autre"];

/** Compose un message WhatsApp prérempli (aucune donnée n'est stockée par le site). */
export function ContactForm() {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const order = String(f.get("order") ?? "").trim();
    const lines = [`Bonjour Ewo, je suis ${String(f.get("name")).trim()}.`, `Sujet : ${f.get("subject")}`];
    if (order) lines.push(`Commande : ${order}`);
    lines.push("", String(f.get("message")).trim());
    const text = lines.join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Nom</span>
        <input name="name" required maxLength={80} autoComplete="name" className="field" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Sujet</span>
          <select name="subject" className="field">
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">N° de commande (facultatif)</span>
          <input name="order" maxLength={80} className="field" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Message</span>
        <textarea name="message" required maxLength={2000} rows={5} className="field" />
      </label>
      <button type="submit" className="btn btn-primary w-full">Envoyer sur WhatsApp</button>
    </form>
  );
}
