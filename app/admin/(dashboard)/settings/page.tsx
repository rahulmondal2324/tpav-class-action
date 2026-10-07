import { requireAdmin } from "@/lib/security";
import { getSettings } from "@/lib/settings";
import AdminHeading from "@/components/AdminHeading";
import SettingsForm from "@/components/SettingsForm";
export default async function Page() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <>
      <AdminHeading
        title="Settings"
        description="Keep your public information up to date."
      />
      <div className="notice">
        Publish the approved author story, privacy policy, terms and contact
        details before launch. Email credentials and storage keys are managed
        through environment variables.
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Email service</span>
          <strong className="small-stat">
            {process.env.RESEND_API_KEY && process.env.EMAIL_FROM
              ? "Configured"
              : "Needs setup"}
          </strong>
        </div>
        <div className="stat-card">
          <span>Image storage</span>
          <strong className="small-stat">
            {process.env.BLOB_READ_WRITE_TOKEN
              ? "Configured"
              : "URL uploads only"}
          </strong>
        </div>
        <div className="stat-card">
          <span>Queue worker</span>
          <strong className="small-stat">
            {process.env.CRON_SECRET ? "Secret configured" : "Needs setup"}
          </strong>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
