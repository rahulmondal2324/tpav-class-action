import PublicLayout from "@/components/PublicLayout";
import { getSettings } from "@/lib/settings";
export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`,
    },
  };
}
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
