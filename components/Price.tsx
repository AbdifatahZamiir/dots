import { formatPrice } from "@/lib/format";

export default function Price({
  price,
  compareAt,
  className = "",
}: {
  price: number;
  compareAt?: number;
  className?: string;
}) {
  if (!compareAt) return <span className={className}>{formatPrice(price)}</span>;
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="text-sale">{formatPrice(price)}</span>
      <s className="text-muted">{formatPrice(compareAt)}</s>
    </span>
  );
}

export function discountPercent(price: number, compareAt?: number) {
  return compareAt ? Math.round((1 - price / compareAt) * 100) : 0;
}
