import { redirect } from "next/navigation";
import { requireAdmin, AppError } from "@/lib/security";
import AdminFrame from "@/components/admin/AdminFrame";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    if (error instanceof AppError && error.status === 401)
      redirect("/admin/login");
    throw error;
  }
  return <AdminFrame name={session.user.name}>{children}</AdminFrame>;
}
