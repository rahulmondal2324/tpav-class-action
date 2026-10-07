import { JoinButton } from "@/components/SubscriptionModal";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
export default function Home() {
  return (
    <>
      <section className="banner-sec">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6 col-md-6 mb-md-0 mb-4 order-md-2">
              <div className="banner-img">
                <img
                  src="/assets/images/banner-img.png"
                  className="img-fluid"
                  alt="Connected people receiving news and updates"
                  fetchPriority="high"
                />
              </div>
            </div>

            <div className="col-lg-5 col-md-6">
              <div className="banner-text-part">
                <div className="banner-sub-heading">
                  Class Action Against TPAV
                </div>
                <h1 className="banner-heading">
                  Stories.Updates.
                  <br />
                  Connection.
                </h1>
                <div className="banner-para">
                  Join our expressions of interest in joining a class action
                  against TPAV and get the latest updates, stories and important
                  news delivered to your inbox.
                </div>
                <SubscribeForm />
                <div className="banner-list">
                  <ul>
                    <li>Free to Join</li>
                    <li>Secure & Private</li>
                    <li>Unsubscribe Anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-sec wrapper">
        <div className="container">
          <div className="sub-heading d-table">Class Action Against TPAV</div>
          <div className="main-heading text-center">How It Works</div>

          <div className="work-body mt-lg-5 mt-4">
            <div className="work-box">
              <div className="work-img">
                <img
                  src="/assets/images/work-img1.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="work-text-part">
                <div className="work-box-heading">Enter Your Email</div>
                <div className="work-box-para">
                  Enter your email address on our website and submit the form.
                </div>
              </div>
            </div>

            <div className="work-box">
              <div className="work-img">
                <img
                  src="/assets/images/work-img2.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="work-text-part">
                <div className="work-box-heading">Confirm Your Email</div>
                <div className="work-box-para">
                  We&apos;ll send you a confirmation email. Click the link to
                  verify your email address.
                </div>
              </div>
            </div>

            <div className="work-box">
              <div className="work-img">
                <img
                  src="/assets/images/work-img3.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="work-text-part">
                <div className="work-box-heading">Receive Updates</div>
                <div className="work-box-para">
                  Receive important stories and updates directly in your inbox.
                </div>
              </div>
            </div>

            <div className="work-box">
              <div className="work-img">
                <img
                  src="/assets/images/work-img4.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
              <div className="work-text-part">
                <div className="work-box-heading">Stay Connected</div>
                <div className="work-box-para">
                  Read the latest news and unsubscribe whenever you choose. No
                  account needed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-sec wrapper">
        <div className="container">
          <div className="row align-items-lg-center">
            <div className="col-lg-4 col-md-4 pe-lg-0 mb-md-0 mb-4">
              <div className="sub-heading">Class Action Against TPAV</div>
              <div className="main-heading">Class Action Against TPAV</div>
              <div className="info-btn">
                <JoinButton>Get Started Now</JoinButton>
              </div>
            </div>

            <div className="col-lg-8 col-md-8">
              <div className="info-body">
                <div className="info-box">
                  <div className="info-box-img">
                    <img
                      src="/assets/images/info-icon1.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="info-box-heading">Authors Story</div>
                  <div className="info-box-para">
                    Read the story behind this initiative.
                  </div>
                  <Link href="/authors-story" className="info-link">
                    Read More
                  </Link>
                </div>

                <div className="info-box">
                  <div className="info-box-img">
                    <img
                      src="/assets/images/info-icon2.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="info-box-heading">Contact Us</div>
                  <div className="info-box-para">
                    Get in touch with our team.
                  </div>
                  <Link href="/contact" className="info-link">
                    Read More
                  </Link>
                </div>

                <div className="info-box">
                  <div className="info-box-img">
                    <img
                      src="/assets/images/info-icon3.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="info-box-heading">Updates</div>
                  <div className="info-box-para">
                    See the latest news and updates.
                  </div>
                  <Link href="/updates" className="info-link">
                    Read More
                  </Link>
                </div>

                <div className="info-box">
                  <div className="info-box-img">
                    <img
                      src="/assets/images/info-icon4.png"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="info-box-heading">Unsubscribe</div>
                  <div className="info-box-para">
                    Manage your email preferences.
                  </div>
                  <Link href="/unsubscribe" className="info-link">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wcu-sec wrapper">
        <div className="container">
          <div className="row align-items-md-center justify-content-lg-between">
            <div className="col-lg-7 col-md-6 pe-lg-4">
              <div className="wcu-img">
                <img
                  src="/assets/images/wcu-img.jpg"
                  className="img-fluid w-100"
                  alt=""
                />
              </div>
            </div>

            <div className="col-lg-5 col-md-6 ps-lg-5">
              <div className="sub-heading">Class Action Against TPAV</div>
              <div className="main-heading">Stay in the Know</div>
              <div className="wcu-para">
                Get the latest stories, updates and news that matter. All in one
                place.
              </div>
              <div className="wcu-list">
                <ul>
                  <li>Important updates delivered to you</li>
                  <li>Unsubscribe anytime, hassle-free</li>
                </ul>
              </div>
              <div className="wcu-btn">
                <JoinButton>Join Now</JoinButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-sec wrapper">
        <div className="container">
          <div className="sub-heading d-table">Class Action Against TPAV</div>
          <h2 className="main-heading text-center">
            Frequently Asked Questions
          </h2>
          <div className="faq-body">
            {[
              [
                "How do I join?",
                "Enter your name and email, then confirm your subscription using the link we send you. No password or account is needed.",
              ],
              [
                "Is it free to join?",
                "Subscribing to email updates is free. A subscription expresses interest and does not, by itself, enroll you in legal proceedings.",
              ],
              [
                "Can I unsubscribe anytime?",
                "Yes. Every update email includes an unsubscribe link. You can stop receiving updates whenever you choose.",
              ],
            ].map(([question, answer]) => (
              <details className="accordion-item" key={question}>
                <summary className="accordion-button">{question}</summary>
                <div className="accordion-body">{answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
