"use client";

import { useState } from "react";
import { MdAdd, MdRemove } from "react-icons/md";

type Item = {
  question: string;
  answer: string;
};

const ITEMS: Item[] = [
  {
    question: "Are NovaQuill signatures legally binding?",
    answer:
      "Yes. NovaQuill complies with the ESIGN Act and UETA in the United States, as well as eIDAS regulations in the European Union.",
  },
  {
    question: "What file types do you support?",
    answer:
      "We currently support PDF, DOCX, PNG, and JPG. All files are automatically converted to a secure, signable PDF format during the upload process to ensure universal compatibility.",
  },
  {
    question: "Is there a limit on free signings?",
    answer:
      "Free accounts include a monthly document allowance. Pro removes limits with unlimited cloud storage and signing—see the pricing page for current numbers.",
  },
  {
    question: "How secure is my data?",
    answer:
      "TLS in transit and AES-256 at rest. Only you can access your documents, and you can permanently delete them at any time.",
  },
];

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <section className="px-6 py-24 bg-nq-surface-container-lowest">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-nq-headline font-bold text-3xl mb-12 text-center text-nq-on-surface">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.question}
                className={`p-6 rounded-2xl bg-nq-surface-container-low ${
                  open ? "border-l-4 border-nq-primary" : ""
                }`}
              >
                <button
                  type="button"
                  className="flex justify-between items-center w-full text-left gap-4"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                >
                  <span className="font-semibold text-lg text-nq-on-surface">{item.question}</span>
                  <span className="text-nq-primary shrink-0" aria-hidden>
                    {open ? <MdRemove className="w-6 h-6" /> : <MdAdd className="w-6 h-6" />}
                  </span>
                </button>
                <p
                  className={`mt-4 text-nq-on-surface-variant text-sm leading-relaxed ${
                    open ? "" : "hidden"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
