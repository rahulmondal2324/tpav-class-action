import PublicFooter from "./PublicFooter";
import PublicNotifications from "./PublicNotifications";
import SubscriptionModal from "./SubscriptionModal";
import { getSettings } from "@/lib/settings";
import { PublicHeader } from "./PublicChrome";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <PublicNotifications>
      <SubscriptionModal>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <PublicHeader />
        <main id="main">{children}</main>
        <PublicFooter settings={settings} />
      </SubscriptionModal>
    </PublicNotifications>
  );
}
