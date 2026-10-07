"use client";
import Link from "next/link";
import { JoinButton } from "./SubscriptionModal";
import { useEffect, useState } from "react";
export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 87);
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);
  return (
    <header className={`header ${scrolled ? "fixed-header" : ""}`}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="logo">
              <Link href="/" aria-label="TPAV Class Action home">
                <img
                  src="/assets/images/logo.png"
                  className="img-fluid"
                  alt="TPAV Class Action"
                  width={170}
                  height={64}
                />
              </Link>
            </div>
          </div>
          <div className="col-6 text-end">
            <div className="header-btn">
              <JoinButton>Get Started</JoinButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const listener = () => setShow(window.scrollY > 250);
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);
  return (
    <button
      id="top"
      aria-label="Back to top"
      className={`upper-arrow ${show ? "show" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Top
      <img src="/assets/images/upper-arrow.png" alt="" />
    </button>
  );
}
