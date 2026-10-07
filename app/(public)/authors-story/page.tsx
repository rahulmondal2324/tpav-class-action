// import InnerPage from "@/components/InnerPage";
// import { getSettings } from "@/lib/settings";
// export const metadata = { title: "Author’s Story" };
// export default async function Page() {
//   const settings = await getSettings();
//   return (
     
     
//      <InnerPage title="Author’s Story">
//       <div className="content-narrow prose">
//         {settings.authorStory ? (
//           settings.authorStory
//             .split(/\n\s*\n/)
//             .map((p, i) => <p key={i}>{p}</p>)
//         ) : (
//           <p>The author’s story will be shared here when it is ready.</p>
//         )}
//       </div>
//     </InnerPage>
//   );
// }
import InnerPage from "@/components/InnerPage";
import styles from "./author-story.module.css";

export const metadata = {
  title: "Author’s Story",
};

export default function Page() {
  return (
    <InnerPage title="Author’s Story">
      <section className={styles.authorStorySection}>
        <div className={styles.authorStoryContainer}>

          {/* =========================================
              INTRO SECTION
          ========================================== */}
          <div className={styles.introGrid}>
            <div className={`${styles.introContent} ${styles.fadeUp}`}>
              <div className={styles.eyebrow}>
                <span></span>
                ABOUT THIS INITIATIVE
              </div>

              <h2>
                A platform for stories,
                <br />
                updates and connection
              </h2>

              <p>
                This website brings together information about the proposed
                class action against TPAV. It provides a place to read
                published stories, follow updates and express interest in
                receiving further information.
              </p>
            </div>

            <div
              className={`${styles.heroVisual} ${styles.fadeUp} ${styles.delay1}`}
            >
              <img
                src="/assets/images/author-story/justice-gavel.jpg"
                alt="Justice and legal information"
              />

              <div className={styles.heroOverlay}>
                <div className={styles.quoteIcon}>“</div>

                <div className={styles.heroQuote}>
                  Stories.
                  <br />
                  Updates.
                  <br />
                  Connection.
                </div>

                <span className={styles.heroLine}></span>
              </div>
            </div>
          </div>

          {/* =========================================
              INFORMATION CARDS
          ========================================== */}
          <div className={styles.infoGrid}>
            {/* CARD 1 */}
            <article
              className={`${styles.infoCard} ${styles.fadeUp} ${styles.delay1}`}
            >
              <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <path d="M8 7h4M8 11h8M8 15h8M8 18h5" />
                  <rect x="14" y="6" width="3" height="3" rx=".4" />
                </svg>
              </div>

              <div className={styles.cardContent}>
                <h3>More than a headline</h3>

                <p>
                  Understanding an issue takes more than a headline. It takes
                  context, clear information and a way to follow developments
                  over time.
                </p>
              </div>
            </article>

            {/* CARD 2 */}
            <article
              className={`${styles.infoCard} ${styles.fadeUp} ${styles.delay2}`}
            >
              <div className={`${styles.iconBox} ${styles.iconGold}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="3" />
                  <circle cx="5.5" cy="10" r="2.2" />
                  <circle cx="18.5" cy="10" r="2.2" />
                  <path d="M6.5 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
                  <path d="M2 18c0-2.3 1.5-4 3.8-4.5" />
                  <path d="M22 18c0-2.3-1.5-4-3.8-4.5" />
                </svg>
              </div>

              <div className={styles.cardContent}>
                <h3>Different perspectives</h3>

                <p>
                  People following the initiative may have different
                  experiences and different questions. Some may want to
                  understand its background. Others may be looking for the
                  latest news or a way to stay connected.
                </p>
              </div>
            </article>

            {/* CARD 3 */}
            <article
              className={`${styles.infoCard} ${styles.fadeUp} ${styles.delay3}`}
            >
              <div className={`${styles.iconBox} ${styles.iconGreen}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 13h3l9 5V6l-9 5H4z" />
                  <path d="M7 14v5" />
                  <path d="M18 9c1 .7 1.5 1.7 1.5 3S19 14.3 18 15" />
                </svg>
              </div>

              <div className={styles.cardContent}>
                <h3>Our purpose</h3>

                <p>
                  The purpose of this website is to make that information
                  easier to find, with published updates available in one place
                  and an email mailing list for those who choose to subscribe.
                </p>
              </div>
            </article>

            {/* CARD 4 */}
            <article
              className={`${styles.infoCard} ${styles.fadeUp} ${styles.delay4}`}
            >
              <div className={`${styles.iconBox} ${styles.iconRed}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 5.5A3.5 3.5 0 0 1 6.5 2H11v17H6.5A3.5 3.5 0 0 0 3 22z" />
                  <path d="M21 5.5A3.5 3.5 0 0 0 17.5 2H13v17h4.5A3.5 3.5 0 0 1 21 22z" />
                </svg>
              </div>

              <div className={styles.cardContent}>
                <h3>Important context</h3>

                <p>
                  Personal accounts and opinions should be distinguished from
                  verified facts and court findings. A statement published on
                  this website should not, by itself, be understood as a
                  finding that an allegation has been established.
                </p>
              </div>
            </article>
          </div>

          {/* =========================================
              FOLLOWING THE STORY
          ========================================== */}
          <div
            className={`${styles.updateSection} ${styles.fadeUp} ${styles.delay2}`}
          >
            <div className={styles.updateContent}>
              <div className={styles.eyebrow}>
                <span></span>
                FOLLOWING THE STORY
              </div>

              <h2>News, commentary and updates</h2>

              <p>
                Visit the <strong>Updates</strong> page for published news and
                commentary. Please consider each article in its context,
                including its publication date and any later corrections or
                developments.
              </p>

              <a href="/updates" className={styles.textLink}>
                View latest updates
                <span>→</span>
              </a>
            </div>

            <div className={styles.updateImage}>
              <img
                src="/assets/images/author-story/latest-updates.jpg"
                alt="Latest updates and published stories"
              />

              <div className={styles.imageFade}></div>

              <div className={styles.latestBadge}>
                <span>Latest</span>
                Updates
              </div>
            </div>
          </div>

          {/* =========================================
              BOTTOM INFO
          ========================================== */}
          <div className={styles.bottomGrid}>
            {/* MAILING LIST */}
            <article
              className={`${styles.bottomCard} ${styles.fadeUp} ${styles.delay2}`}
            >
              <div className={styles.bottomContent}>
                <div className={styles.eyebrow}>
                  <span></span>
                  STAYING CONNECTED
                </div>

                <h2>Join the mailing list</h2>

                <p>
                  You can join the mailing list to receive new stories and
                  updates as they are published. After signing up, confirm your
                  email address using the link sent to your inbox.
                </p>

                <p>
                  You do not need an account or password, and you can
                  unsubscribe at any time.
                </p>

                <a href="/#subscribe" className={styles.textLink}>
                  Subscribe for updates
                  <span>→</span>
                </a>
              </div>

              <div className={`${styles.artCircle} ${styles.paperPlane}`}>
                <svg
                  viewBox="0 0 140 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31 66L113 25L79 111L62 78L31 66Z"
                    fill="#1689E5"
                  />

                  <path
                    d="M62 78L113 25L73 68"
                    stroke="#006CBF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M28 90C43 90 46 106 35 113C24 120 17 110 22 102"
                    stroke="#9EB5CF"
                    strokeWidth="2"
                    strokeDasharray="4 5"
                  />
                </svg>
              </div>
            </article>

            {/* CONTACT */}
            <article
              className={`${styles.bottomCard} ${styles.fadeUp} ${styles.delay3}`}
            >
              <div className={styles.bottomContent}>
                <div className={styles.eyebrow}>
                  <span></span>
                  GETTING IN TOUCH
                </div>

                <h2>Have a question?</h2>

                <p>
                  If you have a question about the initiative, the website or
                  your subscription, use the Contact Us page.
                </p>

                <p>
                  Please keep your initial enquiry brief and avoid including
                  confidential documents, medical information or other
                  sensitive personal details.
                </p>

                <a href="/contact" className={styles.textLink}>
                  Contact us
                  <span>→</span>
                </a>
              </div>

              <div className={`${styles.artCircle} ${styles.chatArt}`}>
                <svg
                  viewBox="0 0 140 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25 39H104V92H57L39 109V92H25V39Z"
                    stroke="#092D55"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M42 56H87M42 68H77"
                    stroke="#092D55"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle cx="99" cy="37" r="25" fill="#FFBF3C" />

                  <path
                    d="M92 30C92 25.8 95.4 23 100 23C104.7 23 108 25.8 108 30C108 34.5 104 35.7 101 38.8V42"
                    stroke="#092D55"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle cx="101" cy="50" r="2.7" fill="#092D55" />
                </svg>
              </div>
            </article>
          </div>

          {/* =========================================
              LEGAL NOTE
          ========================================== */}
          <div
            className={`${styles.legalNotice} ${styles.fadeUp} ${styles.delay4}`}
          >
            <div className={styles.noticeIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 10v6" />
                <path d="M12 7h.01" />
              </svg>
            </div>

            <div>
              <h4>Please keep in mind</h4>

              <p>
                Joining the mailing list does not register you as a party to
                legal proceedings, appoint a lawyer or establish your
                eligibility to participate in a class action.
              </p>
            </div>
          </div>

        </div>
      </section>
    </InnerPage>
  );
}
