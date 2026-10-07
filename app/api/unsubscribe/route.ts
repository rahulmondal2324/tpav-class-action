import { unsubscribe } from "@/lib/subscribers";
import { validToken, AppError } from "@/lib/security";
import { failure } from "@/lib/http";
// RFC 8058: email providers may POST without a browser Origin. The opaque token authorizes only opt-out.
export async function POST(request: Request) {
  try {
    const raw = new URL(request.url).searchParams.get("token");
    if (!validToken(raw)) throw new AppError("Invalid link.");
    await unsubscribe(raw);
    return new Response("Unsubscribed");
  } catch (e) {
    return failure(e);
  }
}
