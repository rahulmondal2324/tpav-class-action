import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./designer.css";
import "./application.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: { default: "Class Action Against TPAV", template: "%s | Class Action Against TPAV" },
  description: "Stories, updates and news from TClass Action Against TPAV.",
  referrer: "no-referrer",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
