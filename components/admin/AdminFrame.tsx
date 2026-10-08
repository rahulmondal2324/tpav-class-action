"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { confirm, showError, success } from "@/lib/alerts";
const links = [
  { href: "dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "blogs", label: "Blogs & stories", icon: Newspaper },
  { href: "subscribers", label: "Subscribers", icon: Users },
  { href: "email-updates", label: "Email updates", icon: Mail },
  { href: "enquiries", label: "Enquiries", icon: Mail },
  { href: "settings", label: "Settings", icon: Settings },
];
export default function AdminFrame({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div className="admin-app">
      {open && (
        <button
          className="admin-overlay"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`admin-nav ${open ? "open" : ""}`}>
        <Link href="/admin/dashboard" className="admin-brand">
          <img
            src="/assets/images/logo.png"
            alt="TPAV Class Action"
            width={165}
          />
          <span>ADMINISTRATION</span>
        </Link>
        <button
          className="mobile-only icon-button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={`/admin/${href}`}
              className={path.startsWith(`/admin/${href}`) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-nav-bottom">
          <Link href="/" target="_blank">
            <ExternalLink size={18} /> View website
          </Link>
          <p>Stories. Updates. Connection.</p>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="mobile-only icon-button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div>
            <span className="eyebrow">CLASS ACTION AGAINST TPAV</span>
            <strong>Website management</strong>
          </div>
          <div className="admin-account">
            <span className="avatar">{name.charAt(0).toUpperCase()}</span>
            <span>{name}</span>
            <button
              className="icon-button"
              disabled={busy}
              aria-label="Log out"
              onClick={async () => {
                if (
                  !(await confirm(
                    "Log out?",
                    "You can sign in again with your admin credentials.",
                  ))
                )
                  return;
                setBusy(true);
                try {
                  const result = await authClient.signOut();
                  if (result.error)
                    throw new Error("Unable to log out. Please retry.");
                  await success("You have been logged out.");
                  router.replace("/admin/login");
                  router.refresh();
                } catch (e) {
                  await showError(
                    e instanceof Error ? e.message : "Please retry.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
