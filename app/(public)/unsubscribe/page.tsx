import InnerPage from "@/components/InnerPage";
import SubscriptionFlow from "@/components/SubscriptionFlow";

export const metadata = {
  title: "Unsubscribe",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  const { token } = await searchParams;

  return (
    <InnerPage title="Unsubscribe">
      <div className="subscription-page-shell">
        <SubscriptionFlow action="unsubscribe" token={token || ""} />
      </div>
    </InnerPage>
  );
}
