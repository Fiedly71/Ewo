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
        <div className="relative aspect-square overflow-hidden bg-surface">
          {image && (
            <Image
              src={image.src}
              alt={product.title}
              fill
              priority={priority}
              sizes="(min-width: 768px) 25vw, 50vw"
              className={`object-cover transition-opacity duration-500 ${hover ? "group-hover:opacity-0" : "group-hover:opacity-90"}`}
            />
          )}
          {hover && <Image src={hover.src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
          {(!available || isNew(product)) && (
            <span className={`badge absolute bottom-3 left-3 ${available ? "badge-sale" : "badge-dark"}`}>{available ? "Nouveau" : "Épuisé"}</span>
          )}
        </div>
        <h3 className="mt-3 text-[15px] leading-snug text-fg group-hover:underline group-hover:underline-offset-[3px]">{product.title}</h3>
        {product.variants.length > 0 && (
          <p className="mt-1 text-[15px] text-fg">
            {min !== max && <span className="text-muted">dès </span>}
            {formatPrice(min)}
          </p>
        )}
      </Link>
      {colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5" aria-label={`${colors.length} couleurs`}>
          {colors.slice(0, 5).map((c) => (
            <span key={c} title={c} className="h-3.5 w-3.5 rounded-full border border-line-strong" style={{ background: colorHex(c) }} />
          ))}
          {colors.length > 5 && <span className="text-xs text-muted">+{colors.length - 5}</span>}
        </div>
      )}
      <WishlistButton product={toSnapshot(product)} />
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}
