import { defineArrayMember, defineField, defineType } from "sanity";

// Orders are created by the website at checkout and updated when Sifalo Pay confirms payment.
// Only "Status" is meant to be edited by hand (e.g. mark as Shipped).
export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({ name: "orderId", title: "Order number", type: "string", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Waiting for payment", value: "pending" },
          { title: "Paid — ready to ship", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Payment failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "total", title: "Order total (USD)", type: "number", readOnly: true }),
    defineField({ name: "amountPaid", title: "Amount paid (USD)", type: "number", readOnly: true }),
    defineField({
      name: "customer",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "city", type: "string" }),
        defineField({ name: "address", type: "string" }),
        defineField({ name: "notes", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "items",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "productId", type: "string" }),
            defineField({ name: "color", type: "string" }),
            defineField({ name: "size", type: "string" }),
            defineField({ name: "qty", title: "Quantity", type: "number" }),
            defineField({ name: "price", title: "Unit price (USD)", type: "number" }),
          ],
          preview: {
            select: { name: "name", color: "color", size: "size", qty: "qty", price: "price" },
            prepare: ({ name, color, size, qty, price }) => ({
              title: `${qty} × ${name}`,
              subtitle: `${color} / ${size} — $${price}`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "paymentType", title: "Paid with", type: "string", readOnly: true }),
    defineField({ name: "account", title: "Paying account", type: "string", readOnly: true }),
    defineField({ name: "sid", title: "Sifalo payment ID (sid)", type: "string", readOnly: true }),
    defineField({ name: "paymentNote", title: "Payment note", type: "string", readOnly: true }),
    defineField({ name: "currency", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "createdAt", title: "Placed", type: "datetime", readOnly: true }),
    defineField({ name: "paidAt", title: "Paid", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { id: "orderId", name: "customer.name", status: "status", total: "total" },
    prepare: ({ id, name, status, total }) => ({
      title: `${id ?? "Order"} — ${name ?? ""}`,
      subtitle: `${(status ?? "pending").toUpperCase()} · $${total ?? 0}`,
    }),
  },
});
