import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const main = product.colors[0].images[0];
  // On hover show the second color (or the second photo) if there is one.
  const hover = product.colors[1]?.images[0] ?? product.colors[0].images[1];

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={main}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 50vw"
          className={`object-cover object-top transition duration-700 group-hover:scale-[1.03] ${
            hover ? "group-hover:opacity-0" : ""
          }`}
        />
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="object-cover object-top opacity-0 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
        <span className="absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
          {product.category}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3 rounded-full ring-1 ring-ink/15"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
