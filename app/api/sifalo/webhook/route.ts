// Sifalo POSTs here when a payment finishes. The body isn't signed, so it is only used
// as a hint: settleOrder() re-checks the payment with Sifalo before changing anything.
import { settleOrder } from "@/lib/orders";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { sid?: unknown; order_id?: unknown };
  const sid = typeof body.sid === "string" ? body.sid : String(body.sid ?? "");
  const orderId = typeof body.order_id === "string" ? body.order_id : "";

  if (sid && /^DOTS-[\w-]+$/.test(orderId)) {
    try {
      await settleOrder(orderId, sid);
    } catch (err) {
      console.error("Webhook check failed", err);
    }
  }
  return Response.json({ ok: true });
}
