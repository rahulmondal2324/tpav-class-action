"use client";

import Link from "next/link";

export default function PublicFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer-sec wrapper">
      <div className="container">
        <div className="row justify-content-between">
          {/* =====================================================
              FOOTER LOGO
          ====================================================== */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-12">
            <div className="footer-logo">
              <Link href="/" aria-label="TPAV Class Action Home">
                <img
                  src="/assets/images/logo.png"
                  className="img-fluid"
                  alt="TPAV Class Action"
                />
              </Link>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-12">
            <div className="footer-heading">Quick links</div>

            <div className="footer-link">
              <ul>
                <li>
                  <Link href="/authors-story">Authors Story</Link>
                </li>

                <li>
                  <Link href="/updates">Updates</Link>
                </li>

                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* =====================================================
              LEGAL
          ====================================================== */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-12">
            <div className="footer-heading">Legal</div>

            <div className="footer-link">
              <ul>
                <li>
                  <Link href="/privacy">Privacy policy</Link>
                </li>

                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* =====================================================
              CONNECT
          ====================================================== */}
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="footer-heading pb-3">Connect</div>

            <div className="social-link">
              <ul>
                {/* FACEBOOK */}
                <li>
                  <a
                    href={settings.facebook || "#"}
                    target={settings.facebook ? "_blank" : undefined}
                    rel={settings.facebook ? "noopener noreferrer" : undefined}
                    aria-label="Facebook"
                  >
                    <img
                      src="/assets/images/fb-icon.png"
                      className="img-fluid"
                      alt="Facebook"
                    />
                  </a>
                </li>

                {/* INSTAGRAM */}
                <li>
                  <a
                    href={settings.instagram || "#"}
                    target={settings.instagram ? "_blank" : undefined}
                    rel={settings.instagram ? "noopener noreferrer" : undefined}
                    aria-label="Instagram"
                  >
                    <img
                      src="/assets/images/insta-icon.png"
                      className="img-fluid"
                      alt="Instagram"
                    />
                  </a>
                </li>

                {/* X / TWITTER */}
                <li>
                  <a
                    href={settings.twitter || settings.x || "#"}
                    target={
                      settings.twitter || settings.x ? "_blank" : undefined
                    }
                    rel={
                      settings.twitter || settings.x
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label="X"
                  >
                    <img
                      src="/assets/images/twitter-icon.png"
                      className="img-fluid"
                      alt="X"
                    />
                  </a>
                </li>

                {/* YOUTUBE */}
                <li>
                  <a
                    href={settings.youtube || "#"}
                    target={settings.youtube ? "_blank" : undefined}
                    rel={settings.youtube ? "noopener noreferrer" : undefined}
                    aria-label="YouTube"
                  >
                    <img
                      src="/assets/images/youtube-icon.png"
                      className="img-fluid"
                      alt="YouTube"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          COPYRIGHT
      ====================================================== */}
      <div className="copyright-text">
        Copyright © {new Date().getFullYear()} Tpav class action Design by{" "}
        <a
          href="https://jrtechnologiesweb.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          JR Technologies Web
        </a>
      </div>

      {/* =====================================================
          SCROLL TO TOP
      ====================================================== */}
      <button
        id="top"
        className="upper-arrow"
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        Top
        <img
          src="/assets/images/upper-arrow.png"
          className="img-fluid"
          alt="upper-arrow"
        />
      </button>
    </footer>
  );
}
