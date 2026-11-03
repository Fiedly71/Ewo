"use client";

import { useRef } from "react";
import { CloseIcon, RulerIcon } from "./icons";

/** Mesures indicatives (vêtement à plat, en cm) des modèles Printify les plus courants. */
const GUIDES = {
  tshirt: {
    label: "T-shirt unisexe",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { name: "Largeur poitrine", values: [46, 51, 56, 61, 66] },
      { name: "Longueur", values: [71, 74, 76, 79, 81] },
    ],
  },
  hoodie: {
    label: "Sweat unisexe",
    sizes: ["S", "M", "L", "XL", "2XL"],
    rows: [
      { name: "Largeur poitrine", values: [51, 56, 61, 66, 71] },
      { name: "Longueur", values: [69, 71, 74, 76, 79] },
    ],
  },
};

export function SizeGuide({ kind = "tshirt" }: { kind?: keyof typeof GUIDES }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4">
        <RulerIcon /> Guide des tailles
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(92vw,560px)] bg-bg p-0 text-fg shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="text-lg font-semibold">Guide des tailles</p>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-8 p-6">
          {(Object.keys(GUIDES) as (keyof typeof GUIDES)[])
            .sort((a) => (a === kind ? -1 : 1))
            .map((k) => {
              const g = GUIDES[k];
              return (
                <div key={k}>
                  <p className="mb-3 font-medium">{g.label}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-line text-left">
                          <th className="py-2 pr-3 font-medium text-muted">cm</th>
                          {g.sizes.map((s) => (
                            <th key={s} className="px-2 py-2 text-center font-semibold">{s}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {g.rows.map((r) => (
                          <tr key={r.name} className="border-b border-line">
                            <td className="py-2 pr-3 text-muted">{r.name}</td>
                            {r.values.map((v, i) => (
                              <td key={i} className="px-2 py-2 text-center">{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          <p className="text-xs text-muted">
            Mesures indicatives prises à plat. En cas de doute entre deux tailles, prenez la plus grande. Écrivez-nous sur WhatsApp pour un conseil.
          </p>
        </div>
      </dialog>
    </>
  );
}
