import Image from "next/image";
import Link from "next/link";
import { colorHex } from "@/lib/colors";
import { formatPrice } from "@/lib/format";
import { colorNames, defaultImage, isAvailable, isNew, priceRange, toSnapshot } from "@/lib/product-utils";
import type { Product } from "@/lib/types";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const image = defaultImage(product);
  const hover = product.images.find((i) => i !== image);
  const { min, max } = priceRange(product);
  const colors = colorNames(product);
  const available = isAvailable(product);

  return (
    <div className="group relative">
      <Link href={`/produits/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
          {image && (
            <Image
              src={image.src}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition duration-500 group-hover:scale-[1.03] ${hover ? "group-hover:opacity-0" : ""}`}
            />
          )}
          {hover && (
            <Image src={hover.src} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {!available && <span className="rounded bg-fg px-2 py-1 text-[11px] font-semibold text-bg">Épuisé</span>}
            {available && isNew(product) && <span className="rounded bg-accent px-2 py-1 text-[11px] font-semibold text-accent-fg">Nouveau</span>}
          </div>
          <span className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-lg bg-bg/95 py-2.5 text-center text-sm font-semibold opacity-0 shadow-sm backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 md:block">
            Choisir les options
          </span>
        </div>
        <h3 className="mt-3 text-sm font-medium group-hover:underline group-hover:underline-offset-4">{product.title}</h3>
        {product.variants.length > 0 && (
          <p className="mt-1 text-sm text-muted">
            {min !== max && "dès "}
            {formatPrice(min)}
          </p>
        )}
      </Link>
      {colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5" aria-label={`${colors.length} couleurs`}>
          {colors.slice(0, 5).map((c) => (
            <span key={c} title={c} className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: colorHex(c) }} />
          ))}
          {colors.length > 5 && <span className="text-xs text-muted">+{colors.length - 5}</span>}
        </div>
      )}
      <WishlistButton product={toSnapshot(product)} />
    </div>
  );
}
