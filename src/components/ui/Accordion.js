"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="glass-card rounded-xl overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-mist-bg/50 transition-colors"
          >
            <span className="font-headline-sub text-headline-sub text-ink-text">
              {item.title}
            </span>
            <span
              className={`material-symbols-outlined text-primary-container transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 pb-5 font-body-md text-slate-subtext">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
