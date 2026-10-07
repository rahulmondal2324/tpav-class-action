import { ZodError } from "zod";
import { AppError } from "./security";
export async function limitedBody(request: Request, limit = 200000) {
  if (Number(request.headers.get("content-length")) > limit)
    throw new AppError("The request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new AppError("The request is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
export async function jsonBody(request: Request) {
  const text = (await limitedBody(request)).toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError("Invalid request.");
  }
}
export function failure(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      { error: error.issues[0]?.message || "Check your entries." },
      { status: 400 },
    );
  if (error instanceof AppError)
    return Response.json({ error: error.message }, { status: error.status });
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    error.code === "P2002"
  )
    return Response.json(
      { error: "That value is already in use. Choose another." },
      { status: 409 },
    );
  const reference = crypto.randomUUID();
  console.error(
    "Request failed",
    reference,
    error instanceof Error ? error.name : "UnknownError",
  );
  return Response.json(
    {
      error: `Something went wrong. Please try again. Reference: ${reference}`,
    },
    { status: 500 },
  );
}
