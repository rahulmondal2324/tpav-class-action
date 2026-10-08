import Link from "next/link";
import InnerPage from "@/components/InnerPage";
import styles from "@/components/LegalPage.module.css";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms governing access to and use of the Class Action Against TPAV website.",
};

export default function Page() {
  return (
    <InnerPage title="Terms of Service">
      <div className={styles.legalPage}>
        {/* =====================================================
            INTRO
        ====================================================== */}
        <section className={`${styles.introPanel} ${styles.fadeUp}`}>
          <div className={styles.introIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 3h8l4 4v14H7z" />
              <path d="M15 3v5h5" />
              <path d="M10 12h6" />
              <path d="M10 16h6" />
              <path d="M10 8h2" />
            </svg>
          </div>

          <div className={styles.introContent}>
            <span className={styles.eyebrow}>WEBSITE TERMS</span>

            <h2>Clear terms for using this website</h2>

            <p>
              These Terms of Service explain the conditions that apply when
              accessing and using the Class Action Against TPAV website. Please read
              them carefully before relying on information published on this
              website.
            </p>

            <div className={styles.metaRow}>
              <span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Last updated: 7 October 2026
              </span>

              <span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Class Action Against TPAV
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK INFORMATION
        ====================================================== */}
        <section className={styles.quickGrid}>
          <article
            className={`${styles.quickCard} ${styles.fadeUp} ${styles.delay1}`}
          >
            <div className={styles.quickIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <path d="M12 8h.01" />
              </svg>
            </div>

            <div>
              <h3>Information only</h3>
              <p>
                Website material is provided for general information and should
                be considered in its proper context.
              </p>
            </div>
          </article>

          <article
            className={`${styles.quickCard} ${styles.fadeUp} ${styles.delay2}`}
          >
            <div className={styles.quickIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 20h16" />
                <path d="M12 3v17" />
                <path d="m8 7-4 6h8z" />
                <path d="m16 7-4 6h8z" />
              </svg>
            </div>

            <div>
              <h3>No legal advice</h3>
              <p>
                Nothing published on this website should be treated as
                personalised legal advice.
              </p>
            </div>
          </article>

          <article
            className={`${styles.quickCard} ${styles.fadeUp} ${styles.delay3}`}
          >
            <div className={styles.quickIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z" />
                <path d="M9 12h6" />
              </svg>
            </div>

            <div>
              <h3>No automatic eligibility</h3>
              <p>
                Using this website or joining the mailing list does not
                establish eligibility to participate in legal proceedings.
              </p>
            </div>
          </article>
        </section>

        {/* =====================================================
            CONTENT LAYOUT
        ====================================================== */}
        <div className={styles.legalLayout}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <span className={styles.sidebarLabel}>On this page</span>

              <nav className={styles.toc}>
                <a href="#acceptance">01. Acceptance</a>
                <a href="#purpose">02. Purpose of the website</a>
                <a href="#legal-advice">03. No legal advice</a>
                <a href="#class-action">04. Class action information</a>
                <a href="#accuracy">05. Accuracy and updates</a>
                <a href="#acceptable-use">06. Acceptable use</a>
                <a href="#subscriptions">07. Email subscriptions</a>
                <a href="#third-party">08. Third-party links</a>
                <a href="#intellectual-property">09. Intellectual property</a>
                <a href="#availability">10. Website availability</a>
                <a href="#liability">11. Liability</a>
                <a href="#privacy">12. Privacy</a>
                <a href="#changes">13. Changes to these terms</a>
                <a href="#contact">14. Contact</a>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className={styles.sections}>
            <section
              id="acceptance"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>01</div>

              <div className={styles.sectionContent}>
                <h2>Acceptance of these terms</h2>

                <p>
                  By accessing, browsing or otherwise using this website, you
                  agree to be bound by these Terms of Service.
                </p>

                <p>
                  If you do not agree with these terms, you should discontinue
                  use of the website.
                </p>
              </div>
            </section>

            <section
              id="purpose"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>02</div>

              <div className={styles.sectionContent}>
                <h2>Purpose of the website</h2>

                <p>
                  This website provides information relating to the proposed
                  class action against TPAV, together with published stories,
                  updates, commentary and information about how interested
                  people may remain informed.
                </p>

                <p>
                  The website may also provide facilities for subscribing to
                  email updates or submitting general enquiries.
                </p>
              </div>
            </section>

            <section
              id="legal-advice"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>03</div>

              <div className={styles.sectionContent}>
                <h2>No legal advice</h2>

                <p>
                  Information published on this website is provided for general
                  informational purposes only.
                </p>

                <p>
                  It is not intended to constitute legal advice, financial
                  advice or other professional advice specific to your
                  circumstances.
                </p>

                <div className={styles.noticeBox}>
                  <div className={styles.noticeIcon}>!</div>

                  <p>
                    You should obtain independent professional advice before
                    making decisions based on your individual circumstances.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="class-action"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>04</div>

              <div className={styles.sectionContent}>
                <h2>Class action information</h2>

                <p>
                  Accessing this website, submitting an enquiry or subscribing
                  to updates does not:
                </p>

                <ul>
                  <li>register you as a party to legal proceedings;</li>
                  <li>appoint a lawyer to act on your behalf;</li>
                  <li>create a solicitor-client relationship;</li>
                  <li>
                    confirm that you are eligible to participate in any class
                    action; or
                  </li>
                  <li>
                    guarantee any particular outcome from legal proceedings.
                  </li>
                </ul>
              </div>
            </section>

            <section
              id="accuracy"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>05</div>

              <div className={styles.sectionContent}>
                <h2>Accuracy and updates</h2>

                <p>
                  We aim to present information clearly and accurately. However,
                  legal proceedings and related developments may change over
                  time.
                </p>

                <p>
                  Published material should therefore be considered together
                  with its publication date and any later updates, corrections
                  or developments.
                </p>

                <p>
                  Personal accounts, commentary or opinions published on the
                  website should not be understood as findings of fact or
                  findings made by a court.
                </p>
              </div>
            </section>

            <section
              id="acceptable-use"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>06</div>

              <div className={styles.sectionContent}>
                <h2>Acceptable use</h2>

                <p>
                  You must not use this website in a way that interferes with
                  its operation, compromises its security or infringes the
                  rights of another person.
                </p>

                <p>In particular, you must not:</p>

                <ul>
                  <li>attempt to gain unauthorised access to the website;</li>
                  <li>introduce malicious software or harmful code;</li>
                  <li>
                    use automated systems to disrupt or overload the website;
                  </li>
                  <li>
                    submit unlawful, abusive, misleading or fraudulent
                    information; or
                  </li>
                  <li>
                    misuse contact or subscription facilities provided through
                    the website.
                  </li>
                </ul>
              </div>
            </section>

            <section
              id="subscriptions"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>07</div>

              <div className={styles.sectionContent}>
                <h2>Email subscriptions</h2>

                <p>
                  If you choose to join the mailing list, we may send you
                  published stories, website updates and other information
                  connected with the initiative.
                </p>

                <p>
                  You may unsubscribe from marketing or general update emails at
                  any time using the unsubscribe facility provided in the
                  relevant communication.
                </p>
              </div>
            </section>

            <section
              id="third-party"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>08</div>

              <div className={styles.sectionContent}>
                <h2>Third-party websites and resources</h2>

                <p>
                  This website may contain links to third-party websites,
                  documents or resources for convenience or reference.
                </p>

                <p>
                  We do not control third-party websites and are not responsible
                  for their availability, security, content or privacy
                  practices.
                </p>
              </div>
            </section>

            <section
              id="intellectual-property"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>09</div>

              <div className={styles.sectionContent}>
                <h2>Intellectual property</h2>

                <p>
                  Unless otherwise stated, the website design, written material,
                  graphics, branding and other original content are protected by
                  applicable intellectual property laws.
                </p>

                <p>
                  Content may be viewed for personal and informational use. It
                  must not be reproduced, republished or commercially exploited
                  without appropriate permission where permission is required.
                </p>
              </div>
            </section>

            <section
              id="availability"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>10</div>

              <div className={styles.sectionContent}>
                <h2>Website availability</h2>

                <p>
                  We may update, suspend, restrict or discontinue any part of
                  the website when reasonably necessary, including for
                  maintenance, security, technical or operational reasons.
                </p>

                <p>
                  Continuous or uninterrupted access to the website cannot be
                  guaranteed.
                </p>
              </div>
            </section>

            <section
              id="liability"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>11</div>

              <div className={styles.sectionContent}>
                <h2>Limitation of liability</h2>

                <p>
                  To the extent permitted by applicable law, we are not
                  responsible for loss arising solely from reliance on general
                  information published on this website without consideration of
                  appropriate professional advice or later developments.
                </p>

                <p>
                  Nothing in these Terms of Service is intended to exclude
                  rights or remedies that cannot lawfully be excluded.
                </p>
              </div>
            </section>

            <section
              id="privacy"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>12</div>

              <div className={styles.sectionContent}>
                <h2>Privacy</h2>

                <p>
                  Information submitted through this website is handled in
                  accordance with our Privacy Policy.
                </p>

                <Link href="/privacy-policy" className={styles.inlineLink}>
                  Read our Privacy Policy
                  <span>→</span>
                </Link>
              </div>
            </section>

            <section
              id="changes"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>13</div>

              <div className={styles.sectionContent}>
                <h2>Changes to these terms</h2>

                <p>
                  These Terms of Service may be updated from time to time to
                  reflect changes to the website, its services or applicable
                  requirements.
                </p>

                <p>
                  The latest version will be published on this page together
                  with an updated revision date.
                </p>
              </div>
            </section>

            <section
              id="contact"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>14</div>

              <div className={styles.sectionContent}>
                <h2>Contact</h2>

                <p>
                  If you have a question about these Terms of Service or the
                  operation of this website, please contact the team through the
                  website’s contact page.
                </p>

                <Link href="/contact" className={styles.primaryLink}>
                  Contact us
                  <span>→</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
