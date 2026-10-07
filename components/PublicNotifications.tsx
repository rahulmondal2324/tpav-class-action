"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./PublicNotifications.module.css";

type Notice = { id: number; text: string; kind: "success" | "error" | "info" };
type Confirmation = {
  title: string;
  text: string;
  resolve: (value: boolean) => void;
};
type Notifications = {
  success: (text: string) => void;
  showError: (text: string) => void;
  info: (text: string) => void;
  confirm: (title: string, text: string) => Promise<boolean>;
};
const Context = createContext<Notifications | null>(null);
export function useNotifications() {
  const value = useContext(Context);
  if (!value) throw new Error("Public notifications provider is missing.");
  return value;
}
function Toast({
  notice,
  dismiss,
}: {
  notice: Notice;
  dismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || notice.kind === "error") return;
    const timer = window.setTimeout(() => dismiss(notice.id), 8000);
    return () => window.clearTimeout(timer);
  }, [notice, dismiss, paused]);
  return (
    <div
      className={`${styles.toast} ${styles[notice.kind]}`}
      role={notice.kind === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <span className={styles.icon} aria-hidden="true">
        {notice.kind === "success" ? "✓" : notice.kind === "error" ? "!" : "i"}
      </span>
      <div>
        <strong>
          {notice.kind === "success"
            ? "All set"
            : notice.kind === "error"
              ? "Please check"
              : "Subscription update"}
        </strong>
        <p>{notice.text}</p>
      </div>
      <button
        type="button"
        onClick={() => dismiss(notice.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
export default function PublicNotifications({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [question, setQuestion] = useState<Confirmation | null>(null);
  const pending = useRef<Confirmation | null>(null);
  const sequence = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const dismiss = useCallback(
    (id: number) =>
      setNotices((items) => items.filter((item) => item.id !== id)),
    [],
  );
  const notify = (kind: Notice["kind"], text: string) => {
    const id = ++sequence.current;
    setNotices((items) => [...items.slice(-3), { id, text, kind }]);
  };
  useEffect(() => {
    if (question) dialog.current?.showModal();
  }, [question]);
  useEffect(
    () => () => {
      pending.current?.resolve(false);
    },
    [],
  );
  function finish(value: boolean) {
    pending.current?.resolve(value);
    pending.current = null;
    dialog.current?.close();
    setQuestion(null);
  }
  return (
    <Context.Provider
      value={{
        success: (text) => notify("success", text),
        showError: (text) => notify("error", text),
        info: (text) => notify("info", text),
        confirm: (title, text) =>
          new Promise((resolve) => {
            if (pending.current) {
              resolve(false);
              return;
            }
            pending.current = { title, text, resolve };
            setQuestion(pending.current);
          }),
      }}
    >
      {children}
      <section className={styles.region} aria-label="Notifications">
        {notices.map((notice) => (
          <Toast key={notice.id} notice={notice} dismiss={dismiss} />
        ))}
      </section>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="public-confirm-title"
        aria-describedby="public-confirm-text"
        onCancel={(e) => {
          e.preventDefault();
          finish(false);
        }}
      >
        <span className={styles.eyebrow}>TPAV CLASS ACTION</span>
        <h2 id="public-confirm-title">{question?.title}</h2>
        <p id="public-confirm-text">{question?.text}</p>
        <div className={styles.actions}>
          <button type="button" autoFocus onClick={() => finish(false)}>
            Cancel
          </button>
          <button type="button" onClick={() => finish(true)}>
            Confirm
          </button>
        </div>
      </dialog>
    </Context.Provider>
  );
}
