"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "./RichEditor";
import { api, confirm, success, showError } from "@/lib/alerts";
type BlogInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  status: string;
  publishedAt: string;
  updatedAt?: string;
};
const empty: BlogInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  status: "DRAFT",
  publishedAt: "",
};
export default function BlogForm({ initial = empty }: { initial?: BlogInput }) {
  const [value, setValue] = useState({
    ...initial,
    publishedAt: initial.publishedAt.slice(0, 16),
  });
  const [slugEdited, setSlugEdited] = useState(!!initial.id);
  const [notify, setNotify] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  function field(key: keyof BlogInput, text: string) {
    setValue((v) => ({ ...v, [key]: text }));
  }
  return (
    <form
      className="panel form-grid"
      onSubmit={async (e) => {
        e.preventDefault();
        if (
          !(await confirm(
            initial.id ? "Save changes?" : "Save this post?",
            notify
              ? "The post will be saved and email notifications queued for verified subscribers."
              : "Your content and publication settings will be saved.",
          ))
        )
          return;
        setBusy(true);
        try {
          const result = await api("/api/admin/blogs", {
            ...value,
            publishedAt: value.publishedAt
              ? new Date(value.publishedAt + ":00.000Z").toISOString()
              : "",
            notify,
          });
          await success(result.message);
          router.push("/admin/blogs");
          router.refresh();
        } catch (e) {
          await showError(e instanceof Error ? e.message : "Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        Title
        <input
          required
          maxLength={180}
          value={value.title}
          onChange={(e) => {
            field("title", e.target.value);
            if (!slugEdited)
              field(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, ""),
              );
          }}
        />
      </label>
      <label>
        Slug
        <input
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          maxLength={180}
          value={value.slug}
          onChange={(e) => {
            setSlugEdited(true);
            field("slug", e.target.value);
          }}
        />
      </label>
      <label className="full">
        Excerpt
        <textarea
          maxLength={500}
          value={value.excerpt}
          onChange={(e) => field("excerpt", e.target.value)}
        />
      </label>
      <div className="full">
        <label>Article content</label>
        <RichEditor
          value={value.content}
          onChange={(v) => field("content", v)}
        />
      </div>
      <label>
        Featured image URL
        <input
          value={value.featuredImage}
          onChange={(e) => field("featuredImage", e.target.value)}
          placeholder="https://…"
        />
      </label>
      <label>
        Upload image · JPG, PNG, WebP · 3 MB
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading || busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const data = new FormData();
              data.set("file", file);
              const r = await fetch("/api/admin/upload", {
                method: "POST",
                body: data,
              });
              const result = await r.json();
              if (!r.ok) throw new Error(result.error);
              field("featuredImage", result.url);
              await success("Image uploaded.");
            } catch (e) {
              await showError(
                e instanceof Error ? e.message : "Upload failed.",
              );
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading && <span role="status">Uploading image…</span>}
      </label>
      {value.featuredImage && (
        <div className="full">
          <img
            className="image-preview"
            src={value.featuredImage}
            alt="Featured image preview"
          />
        </div>
      )}
      <label>
        Status
        <select
          value={value.status}
          onChange={(e) => field("status", e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>
      <label>
        Publish date (UTC)
        <input
          type="datetime-local"
          value={value.publishedAt}
          onChange={(e) => field("publishedAt", e.target.value)}
        />
        <small>
          Leave blank to publish now. Future dates remain hidden until that
          time.
        </small>
      </label>
      <label>
        SEO title
        <input
          maxLength={70}
          value={value.metaTitle}
          onChange={(e) => field("metaTitle", e.target.value)}
        />
      </label>
      <label>
        Keywords
        <input
          maxLength={300}
          value={value.keywords}
          onChange={(e) => field("keywords", e.target.value)}
        />
      </label>
      <label className="full">
        Meta description
        <textarea
          maxLength={170}
          value={value.metaDescription}
          onChange={(e) => field("metaDescription", e.target.value)}
        />
      </label>
      <label className="full consent">
        <input
          type="checkbox"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />{" "}
        Notify verified subscribers on publish
      </label>
      <div className="full actions">
        <button className="button" disabled={busy || uploading}>
          {busy ? "Saving…" : "Save post"}
        </button>
        <a className="button secondary" href="/admin/blogs">
          Cancel
        </a>
      </div>
    </form>
  );
}
