"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const fallbackWorks = [
  { img: "/img-work1.png", title: "Crafting seamless and intuitive digital experiences." },
  { img: "/img-work2.png", title: "Telling captivating stories through art and visuals." },
  { img: "/img-work3.png", title: "Shaping a brand that stands out and resonates." },
  { img: "/img-work4.png", title: "Revolutionizing the user journey with innovative designs." },
  { img: "/img-work5.png", title: "Creating a logo that speaks louder than words." },
  { img: "/img-work6.png", title: "Designing user-focused and accessible interfaces." },
];

export default function Portfolio() {
  const supabase = createClient();
  const [works, setWorks] = useState<{ id: string | null; img: string; title: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setWorks(fallbackWorks.map((w, i) => ({ ...w, id: null }))); setLoaded(true); return; }
    supabase.from("portfolio_items").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setWorks(data.map((item: any) => ({ id: item.id, img: item.img, title: item.title })));
      } else {
        setWorks(fallbackWorks.map((w, i) => ({ ...w, id: null })));
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-6 text-center">Recent Works</h4>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
          A curated selection of design projects showcasing expertise across
          branding, web design, UI/UX, and visual communications.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <div key={w.id ?? w.title} className="overflow-hidden rounded-2xl bg-zorox-white">
              <img src={w.img} alt={w.title} className="w-full object-cover" />
              <div className="p-6">
                <h5 className="mb-4">{w.title}</h5>
                {w.id && (
                  <Link
                    href={`/portfolio/${w.id}`}
                    className="text-sm font-semibold uppercase tracking-[1.2px] text-zorox-accent transition-colors hover:text-zorox-secondary"
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
