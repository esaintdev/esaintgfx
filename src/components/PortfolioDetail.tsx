"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const fallback = {
  title: "UI/UX Design",
  img: "/img-work1.png",
  description:
    "This project focused on transforming LocaTravel's mobile app into a seamless and user-friendly platform. Through comprehensive user research, I identified key areas of frustration, including a cluttered interface, confusing navigation, and lengthy booking processes. The redesign involved creating intuitive wireframes and high-fidelity prototypes that prioritized a clean layout and clear call-to-action buttons. The booking process was streamlined into three simple steps, and visually distinct icons were introduced for better accessibility.",
  client: "Visionary Studio",
  year: "2023-2024",
};

export default function PortfolioDetail({ id }: { id: string }) {
  const supabase = createClient();
  const [item, setItem] = useState<{
    title: string;
    img: string;
    description: string;
    client?: string;
    year?: string;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setItem(fallback); setLoaded(true); return; }
    supabase.from("portfolio_items").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setItem({
          title: data.title,
          img: data.img || "/img-work1.png",
          description: (data as any).description || fallback.description,
          client: (data as any).client || fallback.client,
          year: (data as any).year || fallback.year,
        });
      } else {
        setItem(fallback);
      }
      setLoaded(true);
    });
  }, [id]);

  if (!loaded) return null;
  if (!item) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <div className="mb-8">
          <img src={item.img} alt={item.title} className="w-full rounded-2xl object-cover" />
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h4 className="mb-6">{item.title}</h4>
            <div className="mb-8">
              <h5 className="mb-3 uppercase tracking-[1.2px] text-zorox-accent">Overview</h5>
              <p className="text-sm leading-relaxed text-zorox-text md:text-base">{item.description}</p>
            </div>
          </div>
          <div>
            <div className="mb-8 rounded-2xl bg-zorox-white p-6">
              <h5 className="mb-2">Client</h5>
              <p className="mb-6 text-sm text-zorox-text">{item.client}</p>
              <h5 className="mb-2">Year</h5>
              <p className="text-sm text-zorox-text">{item.year}</p>
            </div>
            <Link
              href="/portfolio"
              className="inline-block rounded-full bg-zorox-accent px-10 py-[14px] text-sm font-semibold uppercase text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
