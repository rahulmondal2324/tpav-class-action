import Link from "next/link";
import InnerPage from "@/components/InnerPage";
import styles from "@/components/LegalPage.module.css";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Information about how the TPAV Class Action website handles personal information.",
};

export default function Page() {
  return (
    <InnerPage title="Privacy Policy">
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
              <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z" />
              <rect x="9" y="10" width="6" height="5" rx="1" />
              <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
            </svg>
          </div>

          <div className={styles.introContent}>
            <span className={styles.eyebrow}>YOUR PRIVACY</span>

            <h2>How we handle your information</h2>

            <p>
              This Privacy Policy explains what information may be collected
              when you use this website, why it may be collected, how it may be
              used and the choices available to you.
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
                Privacy matters
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
                <circle cx="12" cy="8" r="3" />
                <path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
              </svg>
            </div>

            <div>
              <h3>Information you provide</h3>
              <p>
                This may include your name, email address and information you
                submit through forms on the website.
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
                <path d="M4 4h16v16H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </div>

            <div>
              <h3>Communication preferences</h3>
              <p>
                You can unsubscribe from general mailing-list communications
                using the link provided in relevant emails.
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
              <h3>Responsible handling</h3>
              <p>
                Reasonable measures are used to protect information from
                unauthorised access, disclosure or misuse.
              </p>
            </div>
          </article>
        </section>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div className={styles.legalLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <span className={styles.sidebarLabel}>On this page</span>

              <nav className={styles.toc}>
                <a href="#overview">01. Overview</a>
                <a href="#information">02. Information we collect</a>
                <a href="#how-we-use">03. How information is used</a>
                <a href="#subscriptions">04. Email subscriptions</a>
                <a href="#enquiries">05. Contact enquiries</a>
                <a href="#cookies">06. Cookies and usage data</a>
                <a href="#sharing">07. Sharing information</a>
                <a href="#retention">08. Data retention</a>
                <a href="#security">09. Information security</a>
                <a href="#choices">10. Your choices and rights</a>
                <a href="#sensitive">11. Sensitive information</a>
                <a href="#third-party">12. Third-party services</a>
                <a href="#changes">13. Policy changes</a>
                <a href="#contact">14. Contact</a>
              </nav>
            </div>
          </aside>

          <div className={styles.sections}>
            <section
              id="overview"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>01</div>

              <div className={styles.sectionContent}>
                <h2>Privacy overview</h2>

                <p>
                  We recognise the importance of respecting the privacy of
                  people who visit this website, subscribe for updates or
                  contact the team.
                </p>

                <p>
                  This policy explains the types of information that may be
                  collected and the purposes for which that information may be
                  used.
                </p>
              </div>
            </section>

            <section
              id="information"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>02</div>

              <div className={styles.sectionContent}>
                <h2>Information we may collect</h2>

                <p>
                  Depending on how you use the website, we may collect
                  information such as:
                </p>

                <ul>
                  <li>your name;</li>
                  <li>your email address;</li>
                  <li>information contained in an enquiry;</li>
                  <li>
                    your mailing-list subscription and communication
                    preferences;
                  </li>
                  <li>
                    technical information relating to your browser or device;
                  </li>
                  <li>
                    website usage information where analytics or similar
                    technologies are enabled.
                  </li>
                </ul>
              </div>
            </section>

            <section
              id="how-we-use"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>03</div>

              <div className={styles.sectionContent}>
                <h2>How information may be used</h2>

                <p>Information collected through the website may be used to:</p>

                <ul>
                  <li>respond to enquiries;</li>
                  <li>manage mailing-list subscriptions;</li>
                  <li>send requested updates and communications;</li>
                  <li>operate, maintain and secure the website;</li>
                  <li>understand how the website is being used;</li>
                  <li>improve website content and functionality;</li>
                  <li>prevent misuse or fraudulent activity; and</li>
                  <li>meet applicable legal or regulatory obligations.</li>
                </ul>
              </div>
            </section>

            <section
              id="subscriptions"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>04</div>

              <div className={styles.sectionContent}>
                <h2>Email subscriptions</h2>

                <p>
                  If you subscribe to the mailing list, we may use your email
                  address to send published stories, updates and other
                  information relating to the initiative.
                </p>

                <p>
                  Where email confirmation is required, you may receive a
                  verification message asking you to confirm your email address
                  before the subscription becomes active.
                </p>

                <p>
                  You may unsubscribe from general updates at any time using the
                  unsubscribe link included in relevant emails.
                </p>
              </div>
            </section>

            <section
              id="enquiries"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>05</div>

              <div className={styles.sectionContent}>
                <h2>Contact enquiries</h2>

                <p>
                  If you submit an enquiry, the information you provide may be
                  retained for the purpose of reviewing and responding to that
                  enquiry.
                </p>

                <div className={styles.noticeBox}>
                  <div className={styles.noticeIcon}>!</div>

                  <p>
                    Please avoid sending confidential legal documents, detailed
                    medical information or other highly sensitive personal
                    information through the general contact form unless
                    specifically requested.
                  </p>
                </div>
              </div>
            </section>

            <section
              id="cookies"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>06</div>

              <div className={styles.sectionContent}>
                <h2>Cookies and website usage data</h2>

                <p>
                  The website may use cookies or similar technologies that help
                  provide functionality, maintain security, understand website
                  performance or measure how visitors interact with pages.
                </p>

                <p>
                  Your browser may allow you to control or disable certain
                  cookies. Disabling cookies may affect some website
                  functionality.
                </p>
              </div>
            </section>

            <section
              id="sharing"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>07</div>

              <div className={styles.sectionContent}>
                <h2>When information may be shared</h2>

                <p>
                  Personal information is not intended to be sold as a
                  standalone commercial asset.
                </p>

                <p>
                  Information may be disclosed where reasonably necessary to
                  service providers that assist with operating the website,
                  communications, hosting, security or related functionality.
                </p>

                <p>
                  Information may also be disclosed where required or authorised
                  by applicable law.
                </p>
              </div>
            </section>

            <section
              id="retention"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>08</div>

              <div className={styles.sectionContent}>
                <h2>Data retention</h2>

                <p>
                  Information may be retained for as long as reasonably
                  necessary for the purpose for which it was collected,
                  including to manage subscriptions, respond to enquiries,
                  maintain appropriate records and meet applicable legal
                  obligations.
                </p>

                <p>
                  Information that is no longer reasonably required may be
                  deleted, anonymised or securely archived as appropriate.
                </p>
              </div>
            </section>

            <section
              id="security"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>09</div>

              <div className={styles.sectionContent}>
                <h2>Information security</h2>

                <p>
                  Reasonable administrative, technical and organisational
                  measures are used to help protect information against loss,
                  misuse, unauthorised access, alteration or disclosure.
                </p>

                <p>
                  No internet transmission or electronic storage method can be
                  guaranteed to be completely secure.
                </p>
              </div>
            </section>

            <section
              id="choices"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>10</div>

              <div className={styles.sectionContent}>
                <h2>Your choices and rights</h2>

                <p>
                  Subject to applicable law, you may be able to request access
                  to or correction of personal information held about you.
                </p>

                <p>
                  You may also ask questions about how your information is
                  handled or request that certain communications stop.
                </p>
              </div>
            </section>

            <section
              id="sensitive"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>11</div>

              <div className={styles.sectionContent}>
                <h2>Sensitive information</h2>

                <p>
                  The general website enquiry form is not intended to be a
                  secure repository for extensive confidential or sensitive
                  documents.
                </p>

                <p>
                  Where sensitive information is required for a particular
                  purpose, appropriate instructions or a more suitable method of
                  communication may be provided.
                </p>
              </div>
            </section>

            <section
              id="third-party"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>12</div>

              <div className={styles.sectionContent}>
                <h2>Third-party services</h2>

                <p>
                  This website may link to or use services provided by third
                  parties. Those providers may have their own terms and privacy
                  practices.
                </p>

                <p>
                  We encourage you to review the relevant privacy information
                  when interacting directly with third-party services.
                </p>
              </div>
            </section>

            <section
              id="changes"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>13</div>

              <div className={styles.sectionContent}>
                <h2>Changes to this Privacy Policy</h2>

                <p>
                  This Privacy Policy may be updated as website functionality,
                  information-handling practices or applicable requirements
                  change.
                </p>

                <p>
                  The latest version will be published on this page with an
                  updated revision date.
                </p>
              </div>
            </section>

            <section
              id="contact"
              className={`${styles.sectionCard} ${styles.fadeUp}`}
            >
              <div className={styles.sectionNumber}>14</div>

              <div className={styles.sectionContent}>
                <h2>Privacy enquiries</h2>

                <p>
                  If you have a question about this Privacy Policy or how
                  information submitted through the website is handled, please
                  contact the team.
                </p>

                <Link href="/contact" className={styles.primaryLink}>
                  Contact us
                  <span>→</span>
                </Link>

                <Link href="/terms-of-service" className={styles.secondaryLink}>
                  View Terms of Service
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
