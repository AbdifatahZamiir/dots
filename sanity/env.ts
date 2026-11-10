export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-01-01";

// Until a Sanity project is connected, the site uses the products in data/products.json.
export const isSanityConfigured = Boolean(projectId);
