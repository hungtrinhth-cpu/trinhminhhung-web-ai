"use client";

import { useEffect } from "react";

const MAX_REPORTS_PER_LOAD = 20;
const seenMessages = new Set();
let reportCount = 0;

function report({ message, stack, source }) {
  if (!message || reportCount >= MAX_REPORTS_PER_LOAD) return;
  const key = `${source}:${message}`.slice(0, 300);
  if (seenMessages.has(key)) return;
  seenMessages.add(key);
  reportCount += 1;

  fetch("/api/client-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, stack, source, url: window.location.href }),
    keepalive: true,
  }).catch(() => {
    // Don't console.error here — would re-trigger the console.error hook below.
  });
}

/**
 * Lightweight "at least" client error capture (no Sentry account needed).
 * Catches uncaught exceptions, unhandled promise rejections, and anything
 * logged via console.error — including React's hydration-mismatch warnings,
 * which only ever surface through console.error, not as thrown exceptions.
 * Mounted once in the root layout.
 */
export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (event) => {
      report({
        message: event.message || "window.onerror",
        stack: event.error?.stack ?? null,
        source: "window.onerror",
      });
    };
    const onRejection = (event) => {
      const reason = event.reason;
      report({
        message: reason?.message ?? String(reason ?? "unhandledrejection"),
        stack: reason?.stack ?? null,
        source: "unhandledrejection",
      });
    };

    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError(...args);
      try {
        const message = args
          .map((a) => (a instanceof Error ? a.message : typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ")
          .slice(0, 2000);
        const errArg = args.find((a) => a instanceof Error);
        report({ message, stack: errArg?.stack ?? null, source: "console.error" });
      } catch {
        // never let the reporter itself throw inside a console.error override
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
