import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./designer.css";
import "./application.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: { default: "TPAV Class Action", template: "%s | TPAV Class Action" },
  description: "Stories, updates and news from TPAV Class Action.",
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
