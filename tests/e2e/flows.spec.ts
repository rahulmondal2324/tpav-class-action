import { test, expect } from "@playwright/test";
import fs from "node:fs";
const email = process.env.E2E_ADMIN_EMAIL;
test.skip(
  !email || !process.env.E2E_ADMIN_PASSWORD,
  "Supply isolated E2E admin credentials.",
);
test("public design, admin protection, publishing and campaigns", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Stories.Updates./ }),
  ).toBeVisible();
  await expect(page.getByPlaceholder("Enter Your Email Address")).toBeVisible();
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);
  const denied = await request.post("/api/admin/blogs", {
    headers: { Origin: process.env.E2E_BASE_URL || "http://localhost:3000" },
    data: { action: "delete", id: "fake" },
  });
  expect(denied.status()).toBe(401);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel("Email address").fill(email!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/admin-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Create a post" }).click();
  const slug = "test-story-" + Date.now();
  await page.getByLabel("Title", { exact: true }).fill("A community update");
  await page.getByLabel("Slug", { exact: true }).fill(slug);
  await page
    .getByLabel("Excerpt", { exact: true })
    .fill("An update for the community.");
  await page
    .getByRole("textbox", { name: "Article content" })
    .fill("This is a test story with useful news for the community.");
  await page.getByRole("button", { name: "Save post" }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/blogs$/);
  const hidden = await request.get("/updates/" + slug);
  expect(await hidden.text()).toContain("Page not found");
  await page
    .getByRole("row")
    .filter({ hasText: slug })
    .getByRole("link", { name: "Edit", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("PUBLISHED");
  await page.getByRole("button", { name: "Save post" }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  expect((await request.get("/updates/" + slug)).status()).toBe(200);
  await page.goto("/admin/email-updates/new");
  await page
    .getByLabel("Subject", { exact: true })
    .fill("Community newsletter");
  await page.getByLabel("Heading", { exact: true }).fill("Hello community");
  await page
    .getByRole("textbox", { name: "Article content" })
    .fill("Here are the latest developments in our community.");
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/email-updates$/);
  await page.goto("/admin/subscribers");
  await expect(
    page.getByRole("heading", { name: "Subscribers", exact: true }),
  ).toBeVisible();
  await page.goto("/admin/settings");
  await expect(page.getByLabel("Site title", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("link", { name: "Blogs & stories" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/admin-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Close navigation", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});
test("subscriber confirmation, replay rejection and opt-out", async ({
  page,
}) => {
  test.skip(
    !process.env.E2E_OUTBOX_PATH,
    "Requires isolated intercepted mail transport.",
  );
  const subscriberEmail = `reader-${Date.now()}@example.com`;
  await page.goto("/");
  await page.getByRole("button", { name: "Get Started", exact: true }).click();
  await page
    .getByRole("textbox", { name: "First name", exact: true })
    .fill("Test");
  await page
    .getByRole("textbox", { name: "Last name", exact: true })
    .fill("Reader");
  await page
    .getByRole("textbox", { name: /Phone number/ })
    .fill("+61 400 123 456");
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill(subscriberEmail);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Join Now", exact: true })
    .click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const rows = fs
    .readFileSync(process.env.E2E_OUTBOX_PATH!, "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
  const mail = rows.findLast((r) => r.to.includes(subscriberEmail));
  expect(mail).toBeTruthy();
  const url = mail.html.match(/href="([^"]+\/verify\?token=[a-f0-9]+)"/)[1];
  await page.goto(url);
  await page
    .getByRole("button", { name: "Confirm subscription", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page
      .getByText("Your email is verified. You are now subscribed to updates.")
      .first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.goto(url);
  await page
    .getByRole("button", { name: "Confirm subscription", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page.getByText(/invalid, expired, or has already been used/).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill(email!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const created = await page.request.post("/api/admin/campaigns", {
    headers: { Origin: process.env.E2E_BASE_URL || "http://localhost:3000" },
    data: {
      subject: "Subscription flow test",
      heading: "Latest news",
      content: "<p>Here is the latest community news.</p>",
      buttonText: "",
      buttonUrl: "",
    },
  });
  expect(created.ok()).toBeTruthy();
  await page.goto("/admin/email-updates");
  await page.getByRole("link", { name: "Review & logs" }).first().click();
  await page.getByRole("button", { name: /Queue campaign/ }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.goto("/admin/email-updates");
  await page
    .getByRole("button", { name: "Process queue", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const sent = fs
    .readFileSync(process.env.E2E_OUTBOX_PATH!, "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l))
    .findLast(
      (r) => r.to.includes(subscriberEmail) && r.key.startsWith("campaign-"),
    );
  expect(sent).toBeTruthy();
  expect(sent.headers["List-Unsubscribe"]).toContain("/api/unsubscribe?");
  const unsubscribe = sent.html.match(
    /href="([^"]+\/unsubscribe\?token=[a-f0-9]+)"/,
  )[1];
  await page.goto(unsubscribe);
  await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page.getByText(/You have been unsubscribed/).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "OK", exact: true }).click();
});
