import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cleanHtml,
  subscribeSchema,
  blogSchema,
  pageNumber,
} from "../lib/validation";
test("rich text strips scripts, handlers, iframes and unsafe links", () => {
  const html = cleanHtml(
    '<p onclick="steal()">Hello<script>alert(1)</script><a href="javascript:alert(1)">link</a><iframe src="https://bad.test"></iframe><img src=x onerror=alert(1)></p>',
  );
  assert(!html.includes("script"));
  assert(!html.includes("onclick"));
  assert(!html.includes("iframe"));
  assert(!html.includes("img"));
  assert(html.includes("Hello"));
});
test("subscription requires explicit consent and normalises email", () => {
  assert.equal(
    subscribeSchema.parse({
      firstName: " Test ",
      lastName: "Person",
      phoneNumber: "+61 400 123 456",
      email: " TEST@EXAMPLE.COM ",
      consent: true,
    }).email,
    "test@example.com",
  );
  assert(
    !subscribeSchema.safeParse({
      firstName: "Test",
      lastName: "Person",
      phoneNumber: "+61 400 123 456",
      email: "test@example.com",
      consent: false,
    }).success,
  );
  assert(
    !subscribeSchema.safeParse({
      firstName: "Test",
      lastName: "Person",
      phoneNumber: "+61 400 123 456",
      email: "bad",
      consent: true,
    }).success,
  );
  assert(
    !subscribeSchema.safeParse({
      firstName: "Test",
      lastName: "Person",
      phoneNumber: "+61 400 123 456",
      email: "test@example.com",
      consent: true,
      website: "spam",
    }).success,
  );
});
test("blog rejects unsafe slug and content reduced to nothing", () => {
  const draft = {
    title: "Test",
    slug: "test",
    content: "<p>A real article here</p>",
    excerpt: "",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    status: "DRAFT",
    publishedAt: "",
    notify: false,
  };
  assert(blogSchema.safeParse(draft).success);
  assert(!blogSchema.safeParse({ ...draft, slug: "../admin" }).success);
  assert(
    !blogSchema.safeParse({ ...draft, content: "<script>alert(1)</script>" })
      .success,
  );
  assert(
    !blogSchema.safeParse({ ...draft, featuredImage: "javascript:alert(1)" })
      .success,
  );
});
test("pagination rejects invalid values", () => {
  assert.equal(pageNumber("-1"), 1);
  assert.equal(pageNumber("wat"), 1);
  assert.equal(pageNumber("2.5"), 1);
  assert.equal(pageNumber("2"), 2);
});
