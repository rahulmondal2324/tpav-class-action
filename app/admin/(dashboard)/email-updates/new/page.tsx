import { requireAdmin } from "@/lib/security";
import AdminHeading from "@/components/AdminHeading";
import CampaignForm from "@/components/CampaignForm";
export default async function Page() {
  await requireAdmin();
  return (
    <>
      <AdminHeading
        title="New email update"
        description="Write a clear, useful message for your community."
      />
      <CampaignForm />
    </>
  );
}
