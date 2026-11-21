// Sifalo Pay hosted checkout (server only).
// Docs: https://developer.sifalopay.com/docs/hosted-checkout
// Test (staging) only when SIFALO_ENV is "staging"/"sandbox"; anything else uses the live hosts.
const live = !["staging", "sandbox"].includes((process.env.SIFALO_ENV ?? "").trim().toLowerCase());

// Staging and live keys are not interchangeable: staging only works on the .net hosts.
const GATEWAY = live ? "https://api.sifalopay.com/gateway/" : "https://spay-api.sifalo.net/gateway/";
const CHECKOUT = live ? "https://pay.sifalo.com/checkout/" : "https://pay.sifalo.net/checkout/";

const user = process.env.SIFALO_API_USER?.trim();
const key = process.env.SIFALO_API_KEY?.trim();

export const isSifaloConfigured = Boolean(user && key);

export type Verify = {
  sid?: string;
  order_id?: string;
  account?: string;
  payment_type?: string;
  amount?: string | number;
  currency?: string;
  response?: string;
  status?: string;
  code?: string | number;
};

// Step 1: get a key + token and build the URL of Sifalo's payment page.
export async function startCheckout(opts: {
  amountCents: number;
  returnUrl: string;
  webhookUrl?: string;
}): Promise<string> {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: (opts.amountCents / 100).toFixed(2),
      gateway: "checkout",
      currency: "USD",
      return_url: opts.returnUrl,
      ...(opts.webhookUrl ? { webhook_url: opts.webhookUrl } : {}),
    }),
    signal: AbortSignal.timeout(120_000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { key?: string; token?: string; code?: unknown };
  if (!data.key || !data.token) {
    console.error(
      `Sifalo checkout start failed on ${live ? "LIVE" : "STAGING"} host`,
      res.status,
      data,
      Number(data.code) === 0
        ? `— code 0 means the API user/key were rejected. Live keys need SIFALO_ENV=live, staging keys need SIFALO_ENV=staging.`
        : ""
    );
    throw new Error("Payment provider rejected the request");
  }
  return `${CHECKOUT}?key=${encodeURIComponent(data.key)}&token=${encodeURIComponent(data.token)}`;
}

// Step 3: ask Sifalo what really happened to a payment (no Basic auth on this call).
export async function verifyPayment(sid: string): Promise<Verify> {
  const res = await fetch(`${GATEWAY}verify.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sid }),
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });
  return (await res.json().catch(() => ({}))) as Verify;
}

export const isPaid = (v: Verify) => v.status === "success" && Number(v.code) === 601;
export const isPending = (v: Verify) => v.status === "pending" || Number(v.code) === 603;
