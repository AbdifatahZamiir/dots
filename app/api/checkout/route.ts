import Stripe from "stripe";
import { getProducts } from "@/lib/products";

type Item = { id: string; color: string; size: string; qty: number };

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_xxx") {
    return Response.json(
      { error: "Checkout isn't set up yet: add STRIPE_SECRET_KEY to .env.local" },
      { status: 500 }
    );
  }

  const { items } = (await req.json()) as { items: Item[] };

  // Prices always come from the server-side product list, never from the browser.
  const products = await getProducts();
  const line_items = (Array.isArray(items) ? items : []).flatMap((item) => {
    const product = products.find((p) => p.id === item.id);
    const qty = Math.floor(Number(item.qty));
    if (
      !product ||
      !product.sizes.includes(item.size) ||
      !product.colors.some((c) => c.name === item.color) ||
      !(qty > 0 && qty <= 20)
    )
      return [];
    return [
      {
        quantity: qty,
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: { name: `${product.name} — ${item.color} / ${item.size}` },
        },
      },
    ];
  });

  if (line_items.length === 0) {
    return Response.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
    success_url: `${site}/success`,
    cancel_url: `${site}/`,
  });

  return Response.json({ url: session.url });
}
