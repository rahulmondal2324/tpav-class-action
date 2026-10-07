import "sweetalert2/dist/sweetalert2.min.css";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
