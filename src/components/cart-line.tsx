"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";
import { MAX_QTY, useCart } from "./cart-provider";
import { QuantityStepper } from "./quantity-stepper";

export function CartLine({ item, onNavigate, compact }: { item: CartItem; onNavigate?: () => void; compact?: boolean }) {
  const { setQuantity, remove } = useCart();
  const href = item.kind === "collection" ? `/produits/${item.productId}` : "/personnaliser";
  const img = item.kind === "custom" ? item.designUrl : item.image;
  return (
    <li className="flex gap-4 py-5">
      <Link href={href} onClick={onNavigate} className={`relative shrink-0 overflow-hidden bg-surface ${compact ? "h-24 w-20" : "h-32 w-28"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- images Printify, locales ou téléversées */}
        <img src={img} alt="" className={`h-full w-full ${item.kind === "custom" ? "object-contain p-2" : "object-cover"}`} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="line-clamp-2 text-sm font-medium hover:underline">
              {item.title}
            </Link>
            <p className="mt-0.5 text-sm text-muted">{item.variantTitle}</p>
            {item.kind === "custom" && <p className="mt-1 inline-block bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent">Personnalisé</p>}
          </div>
          <p className="shrink-0 text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center gap-4 pt-3">
          <QuantityStepper size="sm" value={item.quantity} max={MAX_QTY} onChange={(q) => setQuantity(item.key, q)} />
          <button type="button" onClick={() => remove(item.key)} className="text-xs text-muted underline underline-offset-4 hover:text-fg">
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}
