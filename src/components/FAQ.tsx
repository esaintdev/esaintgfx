"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What services do you offer?",
    a: "I specialize in UI/UX design, branding, logo design, and illustration. If you have a unique project in mind, feel free to reach out!",
  },
  {
    q: "What is your design process?",
    a: "My process begins with understanding your needs and goals. From there, I create concepts, gather feedback, and refine until we achieve the perfect result.",
  },
  {
    q: "How can I hire you for a project?",
    a: "You can contact me through the contact form or email me directly. Let's discuss your ideas and bring them to life.",
  },
  {
    q: "What sets your work apart?",
    a: "My designs are a blend of creativity, cultural inspiration, and a deep understanding of user needs. I aim to deliver work that is not only visually stunning but also functional and impactful.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-6 text-center">FAQ&apos;s</h4>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
          Got questions? Here are answers to the most common inquiries about my
          services and workflow.
        </p>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="cursor-pointer rounded-2xl bg-zorox-white px-8 py-6"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <h5 className="mb-0">{faq.q}</h5>
                <span className="text-2xl text-zorox-secondary transition-transform duration-300" style={{ transform: openIdx === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </div>
              {openIdx === i && (
                <p className="mt-4 text-sm leading-relaxed text-zorox-text md:text-base">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
