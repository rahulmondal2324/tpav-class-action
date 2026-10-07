"use client";
import { useState } from "react";
import { useSubscription } from "./SubscriptionModal";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const open = useSubscription();
  return (
    <form
      id="subscribe"
      className="subscribe-form subscribe-launcher"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        open(email);
      }}
    >
      <fieldset className="form-part">
        <legend className="sr-only">Join the mailing list</legend>
        <label className="sr-only" htmlFor="subscriber-email">
          Email address
        </label>
        <input
          id="subscriber-email"
          type="email"
          className="form-control"
          autoComplete="email"
          placeholder="Enter Your Email Address"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn-action" aria-haspopup="dialog">
          Join Now
        </button>
      </fieldset>
    </form>
  );
}
