import { getProducts } from "@/lib/products";
import { isSifaloConfigured, startCheckout } from "@/lib/sifalo";
import { createOrder, isOrdersConfigured, newOrderId, type Customer, type OrderItem } from "@/lib/orders";

export const maxDuration = 120; // Sifalo asks for a 120 s timeout

type Item = { id: string; color: string; size: string; qty: number };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!isSifaloConfigured || !isOrdersConfigured) {
    return Response.json(
      {
        error:
          "Checkout isn't set up yet: add SIFALO_API_USER, SIFALO_API_KEY and SANITY_API_WRITE_TOKEN to the environment.",
      },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { items?: Item[]; customer?: Partial<Customer> };

  const c = body.customer ?? {};
  const customer: Customer = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20),
    email: clean(c.email, 120) || undefined,
    city: clean(c.city, 60),
    address: clean(c.address, 200),
    notes: clean(c.notes, 300) || undefined,
  };
  if (customer.name.length < 2 || !/^\+?[\d\s-]{7,20}$/.test(customer.phone) || !customer.city || !customer.address) {
    return Response.json({ error: "Please fill in your name, phone number, city and address." }, { status: 400 });
  }

  // Prices always come from the server-side product list, never from the browser.
  const products = await getProducts();
  const items: OrderItem[] = (Array.isArray(body.items) ? body.items : []).flatMap((item, i) => {
    const product = products.find((p) => p.id === item.id);
    const qty = Math.floor(Number(item.qty));
    if (
      !product ||
      !product.sizes.includes(item.size) ||
      !product.colors.some((col) => col.name === item.color) ||
      !(qty > 0 && qty <= 20)
    )
      return [];
    return [
      {
        _key: `item${i}`,
        productId: product.id,
        name: product.name,
        color: item.color,
        size: item.size,
        qty,
        price: product.price / 100,
      },
    ];
  });

  if (items.length === 0) {
    return Response.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const totalCents = items.reduce((s, it) => s + Math.round(it.price * 100) * it.qty, 0);
  const orderId = newOrderId();
  const site = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, "");

  try {
    await createOrder({ orderId, items, total: totalCents / 100, customer });
    const url = await startCheckout({
      amountCents: totalCents,
      returnUrl: `${site}/api/sifalo/return?order_id=${orderId}`,
      // Sifalo can only call back a public HTTPS address (not localhost).
      webhookUrl: site.startsWith("https://") ? `${site}/api/sifalo/webhook` : undefined,
    });
    return Response.json({ url });
  } catch (err) {
    console.error("Checkout failed", err);
    return Response.json({ error: "We couldn't start the payment. Please try again." }, { status: 502 });
  }
}
