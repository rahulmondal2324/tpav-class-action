import InnerPage from "@/components/InnerPage";
import ContactForm from "@/components/ContactForm";
import styles from "@/components/ContactForm.module.css";
import { getSettings } from "@/lib/settings";
export const metadata = {
  title: "Contact Us",
  description:
    "Contact the TPAV Class Action initiative about updates, the website or your subscription.",
};
export default async function Page() {
  const settings = await getSettings();
  return (
    <InnerPage title="Contact Us">
      <div className={styles.layout}>
        <aside className={styles.aside}>
          <span className={styles.eyebrow}>WE’RE HERE TO LISTEN</span>
          <h2>
            Questions start
            <br />a conversation.
          </h2>
          <p>
            Whether you’re following the initiative, looking for an update or
            need help with your subscription, you can reach the team here.
          </p>
          {settings.contactEmail && (
            <p>
              Prefer email?
              <br />
              <a href={"mailto:" + settings.contactEmail}>
                {settings.contactEmail}
              </a>
            </p>
          )}
          <div className={styles.help}>
            <h3>What happens next?</h3>
            <p>
              Your enquiry is saved for the team to review. Keep the reference
              shown after submission. If a response is needed, the team can use
              the email address you provide.
            </p>
          </div>
        </aside>
        <ContactForm />
      </div>
    </InnerPage>
  );
}
