"use client";

import { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-ink-text/50 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto rounded-2xl max-w-lg w-full"
    >
      <div className="glass-card rounded-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-mist-bg transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
        {title && (
          <h3 className="font-headline-sub text-headline-sub text-ink-text mb-6 pr-10">
            {title}
          </h3>
        )}
        {children}
      </div>
    </dialog>
  );
}
