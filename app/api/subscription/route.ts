import { checkOrigin, validToken, AppError } from "@/lib/security";
import { jsonBody, failure } from "@/lib/http";
import { verifySubscription, unsubscribe } from "@/lib/subscribers";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const body = await jsonBody(request);
    if (!validToken(body.token))
      throw new AppError("The link is invalid.", 400);
    if (body.action === "verify") await verifySubscription(body.token);
    else if (body.action === "unsubscribe") await unsubscribe(body.token);
    else throw new AppError("Invalid action.");
    return Response.json({
      message:
        body.action === "verify"
          ? "Your email is verified. You are now subscribed to updates."
          : "You have been unsubscribed. You will receive no further updates.",
    });
  } catch (e) {
    return failure(e);
  }
}
