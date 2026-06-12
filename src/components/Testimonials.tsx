"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const fallbackTestimonials = [
  { img: "/img-client1.png", name: "Visionary Studio", quote: "Working with Zorox was a game-changer. The designs exceeded our expectations and truly captured our brand vision." },
  { img: "/img-client2.png", name: "Evoke Creations", quote: "Incredible attention to detail and a deep understanding of design principles. Every project delivered on time and beyond." },
  { img: "/img-client3.png", name: "Design Mosaic", quote: "The creative direction and visual identity developed for us transformed how our customers perceive our brand." },
  { img: "/img-client4.png", name: "Canvas Edge", quote: "Professional, creative, and always responsive. Zorox brought our ideas to life with stunning results." },
];

export default function Testimonials() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<{ img: string; name: string; quote: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setTestimonials(fallbackTestimonials); setLoaded(true); return; }
    supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setTestimonials(data.map((t: any) => ({ img: t.img, name: t.name, quote: t.quote })));
      } else {
        setTestimonials(fallbackTestimonials);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="rounded-[48px] bg-zorox-primary p-8 md:p-12">
          <h2 className="mb-10 text-center">What My Client Say</h2>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(0, 2).map((t) => (
                <div key={t.name} className="flex items-center gap-4 md:gap-6">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
                  />
                  <div>
                    <h4 className="mb-2">{t.name}</h4>
                    <p className="text-sm leading-relaxed italic text-zorox-text">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(2, 4).map((t) => (
                <div key={t.name} className="flex items-center gap-4 md:gap-6">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
                  />
                  <div>
                    <h4 className="mb-2">{t.name}</h4>
                    <p className="text-sm leading-relaxed italic text-zorox-text">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
