"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OpenChatButton from "./OpenChatButton";
import { createClient } from "@/lib/supabase/client";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
};

const fallbackServices = [
  { id: "1", title: "Website Design", description: "Building responsive, modern websites that combine beautiful design with optimal performance.", icon: "/icon-Web-Design.png", sort_order: 0 },
  { id: "2", title: "Graphic Design", description: "Bringing ideas to life through stunning visuals, typography, and composition that captivate audiences.", icon: "/icon-Design-Elements.png", sort_order: 1 },
  { id: "3", title: "Branding", description: "Developing cohesive brand identities that communicate your values and resonate with your target market.", icon: "/icon-Branding.png", sort_order: 2 },
  { id: "4", title: "Logo Design", description: "Creating memorable logos that embody your brand essence and stand the test of time.", icon: "/icon-Logo-Design.png", sort_order: 3 },
  { id: "5", title: "UI/UX Design", description: "Crafting intuitive interfaces and seamless user flows that delight users and drive engagement.", icon: "/icon-Vector-Graphics.png", sort_order: 4 },
];

export default function Services() {
  const supabase = createClient();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setServices(fallbackServices);
      setLoaded(true);
      return;
    }
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(fallbackServices);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-12 text-center">What I Do?</h4>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-zorox-white p-8 text-center transition-shadow hover:shadow-lg"
            >
              {s.icon && (
                <img
                  src={s.icon}
                  alt={s.title}
                  className="mx-auto mb-6 h-16 w-16 object-contain"
                />
              )}
              <h5 className="mb-4">{s.title}</h5>
              <p className="mb-6 text-sm leading-relaxed text-zorox-text md:text-base">
                {s.description}
              </p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-zorox-accent p-8 text-center text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[1.2px]">
              Request fo more
            </p>
            <h4 className="mb-4 text-white">Have project in Mind?</h4>
            <OpenChatButton className="inline-block rounded-full bg-white px-10 py-[14px] text-sm font-semibold uppercase tracking-[-0.5px] text-zorox-accent transition-colors hover:bg-zorox-secondary hover:text-zorox-accent">
              Let&apos;s Talk!
            </OpenChatButton>
          </div>
        </div>
      </div>
    </section>
  );
}
