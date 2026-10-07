import { requireAdmin } from "@/lib/security";
import AdminHeading from "@/components/AdminHeading";
import BlogForm from "@/components/BlogForm";
export default async function Page() {
  await requireAdmin();
  return (
    <>
      <AdminHeading
        title="New story"
        description="Start with a draft. Publish when your story is ready."
      />
      <BlogForm />
    </>
  );
}
