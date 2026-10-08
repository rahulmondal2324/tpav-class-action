import Link from "next/link";
import styles from "./InnerPage.module.css";

export default function InnerPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ======================================================
          COMMON INNER PAGE BANNER
      ====================================================== */}
      <section className={styles.innerBanner}>
        {/* Decorative background */}
        <div className={styles.bannerGlowLeft}></div>
        <div className={styles.bannerGlowRight}></div>

        <div className={styles.bannerPattern}></div>

        <div className={styles.bannerContainer}>
          <div className={styles.bannerContent}>
            {/* Top accent */}
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine}></span>

              <span>Class Action Against TPAV</span>

              <span className={styles.eyebrowLine}></span>
            </div>

            {/* Page title */}
            <h1 className={styles.bannerHeading}>{title}</h1>

            {/* Breadcrumb */}
            <nav className={styles.breadcrumbNav} aria-label="breadcrumb">
              <ol className={styles.breadcrumb}>
                <li>
                  <Link href="/">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 11.5 12 4l9 7.5" />
                      <path d="M5.5 10v9h13v-9" />
                      <path d="M9.5 19v-5h5v5" />
                    </svg>

                    <span>Home</span>
                  </Link>
                </li>

                <li className={styles.breadcrumbSeparator} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </li>

                <li className={styles.currentPage} aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={styles.bottomLine}>
          <span></span>
        </div>
      </section>

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}
      <main className={styles.innerSection}>
        <div className={styles.contentContainer}>{children}</div>
      </main>
    </>
  );
}
