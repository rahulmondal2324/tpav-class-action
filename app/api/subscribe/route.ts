import { subscribeSchema } from "@/lib/validation";
import { checkOrigin, rateLimit, requestIp } from "@/lib/security";
import { jsonBody, failure } from "@/lib/http";
import { requestVerification } from "@/lib/subscribers";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const data = subscribeSchema.parse(await jsonBody(request));
    await rateLimit("subscribe-ip:" + requestIp(request), 20, 3600);
    const result = await requestVerification(
      data.firstName + " " + data.lastName,
      data.email,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        consentAt: new Date().toISOString(),
      },
    );
    return Response.json({
      status: result.status,
      message:
        result.status === "already_subscribed"
          ? "You’re already subscribed with this email address. You’ll receive new Class Action Against TPAV updates as they are published."
          : "Your confirmation email is on its way. Please check your inbox and spam folder to complete your subscription.",
    });
  } catch (error) {
    return failure(error);
  }
}
