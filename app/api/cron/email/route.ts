import { processQueue } from "@/lib/campaigns";
import { secureEqual } from "@/lib/security";
import { failure } from "@/lib/http";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    !secureEqual(
      request.headers.get("authorization") || "",
      `Bearer ${process.env.CRON_SECRET}`,
    )
  )
    return new Response("Unauthorized", { status: 401 });
  try {
    return Response.json(await processQueue());
  } catch (e) {
    return failure(e);
  }
}
