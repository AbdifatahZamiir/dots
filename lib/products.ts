// Server-side product data. Reads from Sanity when it's connected,
// otherwise falls back to data/products.json.
import { createClient } from "next-sanity";
import localData from "@/data/products.json";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import type { Product } from "./types";

export type { Product, Variant } from "./types";

const localProducts = localData as Product[];

const QUERY = `*[_type == "product" && defined(slug.current)]
  | order(coalesce(order, 9999) asc, _createdAt desc) {
    "id": slug.current,
    name,
    category,
    price,
    compareAtPrice,
    "description": coalesce(description, ""),
    "details": coalesce(details, []),
    "sizes": coalesce(sizes, []),
    "colors": colors[]{ name, hex, "images": images[].asset->url }
  }`;

type Raw = Omit<Product, "price" | "compareAt"> & {
  price: number | null;
  compareAtPrice?: number | null;
};

export function categoriesOf(products: Product[]) {
  return [...new Set(products.map((p) => p.category))];
}

export async function getProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return localProducts;

  const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  const rows = await client.fetch<Raw[]>(QUERY, {}, { next: { revalidate: 60, tags: ["product"] } });

  return rows
    .map(({ compareAtPrice, ...p }) => ({
      ...p,
      price: Math.round((p.price ?? 0) * 100), // CMS stores dollars, the site uses cents
      compareAt:
        compareAtPrice && compareAtPrice > (p.price ?? 0)
          ? Math.round(compareAtPrice * 100)
          : undefined,
      colors: (p.colors ?? [])
        .map((c) => ({ ...c, images: (c.images ?? []).filter(Boolean) }))
        .filter((c) => c.name && c.images.length > 0),
    }))
    .filter((p) => p.name && p.price > 0 && p.sizes.length > 0 && p.colors.length > 0);
}

export async function getProduct(id: string) {
  return (await getProducts()).find((p) => p.id === id);
}
