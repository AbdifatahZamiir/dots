import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "Click “Generate” — this becomes the product's web address.",
      options: { source: "name", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: ["Outerwear", "Knitwear", "Shirts", "T-Shirts", "Trousers", "Accessories"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      description: "For example 89 or 89.50",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Original price (USD) — optional",
      type: "number",
      description:
        "To put an item on sale, enter the old price here and the sale price above. Leave empty when not on sale.",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "details",
      title: "Details (bullet points)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "sizes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Type a size and press Enter, e.g. S, M, L, XL",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "colors",
      title: "Colors & photos",
      type: "array",
      description: "Add one entry per color, each with its own photos. The first photo is the main one.",
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "colorVariant",
          title: "Color",
          fields: [
            defineField({
              name: "name",
              title: "Color name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "hex",
              title: "Swatch color",
              type: "string",
              description: "Hex code for the color dot, e.g. #1b2340",
              validation: (r) =>
                r.required().regex(/^#[0-9a-fA-F]{6}$/, { name: "hex color" }),
            }),
            defineField({
              name: "images",
              title: "Photos",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              options: { layout: "grid" },
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: "name", subtitle: "hex", media: "images.0" } },
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in the shop (optional).",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "colors.0.images.0" },
  },
});

export const schemaTypes = [product];
