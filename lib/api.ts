"use client";

export async function api(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The server is unavailable. Please try again.");
  }
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
