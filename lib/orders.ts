// Orders are saved in Sanity so they show up in the admin (/studio).
// Order IDs start with "orders." — documents with a dot in their ID are never
// readable without a token, even when the dataset itself is public.
import { createClient } from "@sanity/client";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import { isPaid, isPending, verifyPayment, type Verify } from "./sifalo";

const token = process.env.SANITY_API_WRITE_TOKEN;
export const isOrdersConfigured = isSanityConfigured && Boolean(token);

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

export type OrderStatus = "pending" | "paid" | "failed" | "shipped" | "cancelled";

export type OrderItem = {
  _key: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number; // dollars
};

export type Customer = { name: string; phone: string; email?: string; city: string; address: string; notes?: string };

type Order = {
  _id: string;
  orderId: string;
  status: OrderStatus;
  total: number; // dollars
  sid?: string;
};

const docId = (orderId: string) => `orders.${orderId}`;

export function newOrderId() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `DOTS-${date}-${rand}`;
}

export async function createOrder(o: { orderId: string; items: OrderItem[]; total: number; customer: Customer }) {
  await client.create({
    _id: docId(o.orderId),
    _type: "order",
    orderId: o.orderId,
    status: "pending",
    total: o.total,
    currency: "USD",
    customer: o.customer,
    items: o.items,
    createdAt: new Date().toISOString(),
  });
}

function getOrder(orderId: string) {
  return client.fetch<Order | null>(`*[_id == $id][0]{ _id, orderId, status, total, sid }`, {
    id: docId(orderId),
  });
}

/**
 * Check a payment with Sifalo and update the order. Used by the return URL and the webhook.
 * Only Sifalo's verify answer is trusted, never what the browser or webhook body says.
 */
export async function settleOrder(orderId: string, sid: string): Promise<"paid" | "pending" | "failed"> {
  const order = await getOrder(orderId);
  if (!order) return "failed";
  if (order.status === "paid" || order.status === "shipped") return "paid";

  const v: Verify = await verifyPayment(sid);
  const paidCents = Math.round(Number(v.amount) * 100);

  if (isPaid(v)) {
    const problems = [
      (v.currency ?? "USD").toUpperCase() !== "USD" && "wrong currency",
      !(paidCents >= Math.round(order.total * 100)) && `paid ${v.amount}, expected ${order.total}`,
      v.order_id && v.order_id !== orderId && `payment belongs to order ${v.order_id}`,
      (await client.fetch<number>(`count(*[_type == "order" && sid == $sid && _id != $id])`, {
        sid,
        id: order._id,
      })) > 0 && "payment already used for another order",
    ].filter(Boolean);

    if (problems.length === 0) {
      await client
        .patch(order._id)
        .set({
          status: "paid",
          sid,
          paymentType: v.payment_type,
          account: v.account,
          amountPaid: Number(v.amount),
          paidAt: new Date().toISOString(),
        })
        .commit();
      return "paid";
    }
    console.error(`Order ${orderId}: payment ${sid} not accepted:`, problems.join(", "));
    await client.patch(order._id).set({ status: "failed", sid, paymentNote: problems.join(", ") }).commit();
    return "failed";
  }

  if (isPending(v)) {
    await client.patch(order._id).set({ sid }).commit();
    return "pending";
  }

  await client
    .patch(order._id)
    .set({ status: "failed", sid, paymentNote: v.response ?? `code ${v.code ?? "unknown"}` })
    .commit();
  return "failed";
}
