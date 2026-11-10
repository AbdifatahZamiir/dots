export type Variant = {
  name: string;
  hex: string; // swatch color
  images: string[]; // files in /public/products
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number; // in cents (12900 = $129.00)
  description: string;
  details: string[];
  sizes: string[];
  colors: Variant[];
};

export const products: Product[] = [
  {
    id: "wrap-jacket",
    name: "Wrap Jacket",
    category: "Outerwear",
    price: 12900,
    description:
      "A soft, structured wrap jacket with a single horn-effect button and a clean collarless neckline. Wear it over a crisp shirt or a plain tee.",
    details: [
      "Brushed wool-blend fabric",
      "Single-button asymmetric closure",
      "Dropped shoulders, relaxed fit",
      "Dry clean only",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Burgundy", hex: "#5a1520", images: ["/products/jacket-burgundy.jpg"] },
      { name: "Navy", hex: "#141d3b", images: ["/products/jacket-navy.jpg"] },
    ],
  },
  {
    id: "half-zip-knit",
    name: "Half-Zip Rib Knit",
    category: "Knitwear",
    price: 8900,
    description:
      "A ribbed half-zip with raglan sleeves and a stand collar. It has a relaxed shape that looks good layered over a white tee.",
    details: [
      "Ribbed cotton blend knit",
      "Metal half-zip with stand collar",
      "Raglan sleeves, ribbed cuffs and hem",
      "Machine wash cold",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Cream",
        hex: "#e6e0d4",
        images: [
          "/products/halfzip-cream-1.jpg",
          "/products/halfzip-cream-2.jpg",
          "/products/halfzip-cream-3.jpg",
          "/products/halfzip-cream-4.jpg",
        ],
      },
      {
        name: "Brown",
        hex: "#4a3b30",
        images: [
          "/products/halfzip-brown-1.jpg",
          "/products/halfzip-brown-2.jpg",
          "/products/halfzip-brown-3.jpg",
          "/products/halfzip-brown-4.jpg",
        ],
      },
    ],
  },
  {
    id: "crewneck-knit",
    name: "Classic Crewneck",
    category: "Knitwear",
    price: 7900,
    description:
      "A fine-gauge crewneck you can wear every day. It's slim enough to layer over a collared shirt and easy to wear on its own.",
    details: [
      "Fine-gauge merino blend",
      "Ribbed neck, cuffs and hem",
      "Regular fit",
      "Hand wash or gentle cycle",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Grey", hex: "#b9b9b7", images: ["/products/crew-grey.jpg", "/products/crew-group.jpg"] },
      { name: "Navy", hex: "#1b2340", images: ["/products/crew-navy.jpg", "/products/crew-group.jpg"] },
      { name: "Black", hex: "#111111", images: ["/products/crew-black.jpg", "/products/crew-group.jpg"] },
    ],
  },
  {
    id: "linen-shirt",
    name: "Linen Shirt",
    category: "Shirts",
    price: 6900,
    description:
      "A lightweight linen shirt with a soft collar and a relaxed fit. It looks best with the sleeves rolled and a couple of buttons left open.",
    details: [
      "100% washed linen",
      "Relaxed fit, curved hem",
      "Mother-of-pearl effect buttons",
      "Machine wash, line dry",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#4f5440", images: ["/products/shirt-olive.jpg"] },
      { name: "Stone", hex: "#bcb3a6", images: ["/products/shirt-stone.jpg"] },
    ],
  },
  {
    id: "pleated-trouser",
    name: "Pleated Wide Trouser",
    category: "Trousers",
    price: 9500,
    description:
      "A wide-leg trouser with double front pleats and a sharp centre crease. It drapes well over sneakers or loafers.",
    details: [
      "Soft wool-feel twill",
      "Double front pleats, pressed crease",
      "Wide straight leg",
      "Dry clean recommended",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      {
        name: "Charcoal",
        hex: "#3a3a3c",
        images: [
          "/products/halfzip-brown-3.jpg",
          "/products/halfzip-cream-4.jpg",
          "/products/halfzip-brown-1.jpg",
        ],
      },
    ],
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getVariant(product: Product, color: string) {
  return product.colors.find((c) => c.name === color) ?? product.colors[0];
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}
