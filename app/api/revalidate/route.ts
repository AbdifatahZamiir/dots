// Optional: a Sanity webhook calls this so product changes show up instantly
// (without it, changes still appear within ~60 seconds).
import { revalidatePath, revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });

  const { isValidSignature } = await parseBody(req as never, secret);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  revalidateTag("product");
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
