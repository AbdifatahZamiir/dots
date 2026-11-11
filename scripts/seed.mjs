// Imports the products in data/products.json (with their photos) into Sanity.
// Run once:  node --env-file=.env.local scripts/seed.mjs
// Safe to re-run: products are created or replaced by their URL slug.
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });
const root = process.cwd();
const products = JSON.parse(readFileSync(join(root, "data/products.json"), "utf8"));

const uploaded = new Map(); // reuse the same photo across products
async function upload(path) {
  if (!uploaded.has(path)) {
    const asset = await client.assets.upload("image", createReadStream(join(root, "public", path)), {
      filename: basename(path),
    });
    console.log("  uploaded", path);
    uploaded.set(path, asset._id);
  }
  return uploaded.get(path);
}

const key = () => randomUUID().slice(0, 12);

for (const [i, p] of products.entries()) {
  console.log(`→ ${p.name}`);
  const colors = [];
  for (const c of p.colors) {
    const images = [];
    for (const img of c.images) {
      images.push({ _type: "image", _key: key(), asset: { _type: "reference", _ref: await upload(img) } });
    }
    colors.push({ _type: "colorVariant", _key: key(), name: c.name, hex: c.hex, images });
  }
  await client.createOrReplace({
    _id: `product-${p.id}`,
    _type: "product",
    name: p.name,
    slug: { _type: "slug", current: p.id },
    category: p.category,
    price: p.price / 100,
    ...(p.compareAt ? { compareAtPrice: p.compareAt / 100 } : {}),
    description: p.description,
    details: p.details,
    sizes: p.sizes,
    colors,
    order: i + 1,
  });
}

console.log(`\nDone — imported ${products.length} products.`);
