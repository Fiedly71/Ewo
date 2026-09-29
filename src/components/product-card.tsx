import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images.find((i) => i.isDefault) ?? product.images[0];
  const from = Math.min(...product.variants.map((v) => v.price));
  return (
    <Link href={`/produits/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-black/5">
        {image && (
          <Image
            src={image.src}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="mt-3 font-semibold">{product.title}</h3>
      {Number.isFinite(from) && <p className="text-sm text-black/60">dès {formatPrice(from)}</p>}
    </Link>
  );
}
