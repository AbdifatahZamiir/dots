export type Variant = {
  name: string;
  hex: string; // swatch color
  images: string[]; // image URLs (local /products/... or Sanity CDN)
};

export type Product = {
  id: string; // URL slug
  name: string;
  category: string;
  price: number; // in cents (12900 = $129.00)
  compareAt?: number; // original price in cents, when on sale
  description: string;
  details: string[];
  sizes: string[];
  colors: Variant[];
};
