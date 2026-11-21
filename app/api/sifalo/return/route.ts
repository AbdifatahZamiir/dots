// The customer's browser lands here after paying on Sifalo's page (?order_id=…&sid=…).
import { settleOrder } from "@/lib/orders";

export const maxDuration = 60;

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const orderId = params.get("order_id") ?? "";
  const sid = params.get("sid") ?? "";
  const go = (path: string) => Response.redirect(new URL(path, req.url), 303);

  if (!/^DOTS-[\w-]+$/.test(orderId)) return go("/checkout?status=failed");
  if (!sid) return go("/checkout?status=cancelled");

  try {
    const result = await settleOrder(orderId, sid);
    if (result === "paid") return go(`/success?order=${orderId}`);
    if (result === "pending")
      return go(`/checkout?status=pending&order=${orderId}&sid=${encodeURIComponent(sid)}`);
    return go("/checkout?status=failed");
  } catch (err) {
    console.error("Payment check failed", err);
    return go(`/checkout?status=pending&order=${orderId}&sid=${encodeURIComponent(sid)}`);
  }
}
