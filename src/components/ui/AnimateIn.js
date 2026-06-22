"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimateIn({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  // If IntersectionObserver is unsupported, start visible immediately
  const [visible, setVisible] = useState(
    typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: no IntersectionObserver support → reveal immediately
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Fix #13: declare will-change before the transition so the browser can
    // promote the element to its own compositor layer ahead of time.
    el.style.willChange = "transform, opacity";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();

          // Fix #13: release the compositor layer once the animation is done
          // (transition duration is 750ms + delay prop, add a small buffer).
          const releaseDelay = 750 + delay + 100;
          setTimeout(() => {
            el.style.willChange = "auto";
          }, releaseDelay);
        }
      },
      // threshold: 0 — any single pixel entering the viewport triggers the reveal.
      // This prevents content from staying permanently hidden on small viewports
      // where the element may never reach 12% visibility during fast scrolling.
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // delay is used inside the observer callback for the will-change cleanup timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
