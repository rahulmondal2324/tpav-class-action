import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security";
import AdminHeading from "@/components/AdminHeading";
export default async function Page() {
  await requireAdmin();
  const [blogs, published, subscribers, active, campaigns, recent] =
    await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      }),
      prisma.subscriber.count(),
      prisma.subscriber.count({
        where: { emailVerified: true, subscribed: true },
      }),
      prisma.emailCampaign.count({ where: { status: "SENDING" } }),
      prisma.blog.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
    ]);
  return (
    <>
      <AdminHeading
        title="Overview"
        description="A clear view of your stories and community."
      >
        <Link className="button" href="/admin/blogs/add">
          Create a post
        </Link>
      </AdminHeading>
      <div className="stats-grid">
        {[
          ["Total stories", blogs],
          ["Published", published],
          ["Active subscribers", active],
          ["Campaigns in progress", campaigns],
        ].map(([label, value]) => (
          <div className="stat-card" key={String(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading">
            <h2>Recent stories</h2>
            <Link href="/admin/blogs">View all</Link>
          </div>
          {recent.length ? (
            recent.map((p) => (
              <Link
                className="recent-row"
                key={p.id}
                href={"/admin/blogs/" + p.id + "/edit"}
              >
                <div>
                  <strong>{p.title}</strong>
                  <small>{p.updatedAt.toLocaleDateString("en-AU")}</small>
                </div>
                <span className={"badge " + p.status.toLowerCase()}>
                  {p.status}
                </span>
              </Link>
            ))
          ) : (
            <div className="empty-state compact">
              <h3>Your first story starts here</h3>
              <p>Create a draft and publish when you’re ready.</p>
            </div>
          )}
        </section>
        <section className="panel soft-panel">
          <span className="eyebrow">YOUR COMMUNITY</span>
          <h2>Keep the conversation going</h2>
          <p>
            {subscribers} people have expressed interest. {active} are verified
            and subscribed.
          </p>
          <Link className="button" href="/admin/email-updates/new">
            Write an email update
          </Link>
          <p className="mt-4 muted">
            Emails go only to people who have confirmed their subscription.
          </p>
        </section>
      </div>
    </>
  );
}
