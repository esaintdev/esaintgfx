"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const fallbackExperience = [
  { period: "2014-2016", title: "Graphic Designer", desc: "Developed visual assets for print and digital media, creating compelling brand materials that helped clients establish their market presence." },
  { period: "2017-2020", title: "Website Designer", desc: "Designed and launched responsive websites for diverse clients, focusing on clean layouts, intuitive navigation, and conversion-driven design." },
  { period: "2021-2025", title: "UI/UX Designer", desc: "Led end-to-end product design for web applications, conducting user research and crafting interfaces that balance beauty with usability." },
];

const fallbackSkills = [
  { label: "Graphic Designer", pct: 90 },
  { label: "UI/UX", pct: 85 },
  { label: "Branding", pct: 80 },
  { label: "Web Development", pct: 75 },
];

export default function ExperienceSkills() {
  const supabase = createClient();
  const [experience, setExperience] = useState<{ period: string; title: string; desc: string }[]>([]);
  const [skills, setSkills] = useState<{ label: string; pct: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoaded(true); return; }
    Promise.all([
      supabase.from("experience_items").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]).then(([expRes, skillRes]) => {
      if (expRes.data && expRes.data.length > 0) {
        setExperience(expRes.data.map((e: any) => ({ period: e.period, title: e.title, desc: e.description })));
      } else {
        setExperience(fallbackExperience);
      }
      if (skillRes.data && skillRes.data.length > 0) {
        setSkills(skillRes.data.map((s: any) => ({ label: s.label, pct: s.percentage })));
      } else {
        setSkills(fallbackSkills);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="rounded-[48px] bg-zorox-primary p-8 md:p-12">
          <h2 className="mb-10 text-center">My Experience and Skills</h2>
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <div className="flex flex-col gap-8">
                {experience.map((exp) => (
                  <div key={exp.title}>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[1.2px] text-zorox-accent">
                      {exp.period}
                    </p>
                    <h5 className="mb-2">{exp.title}</h5>
                    <p className="text-sm leading-relaxed text-zorox-text md:text-base">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-6">
                {skills.map((skill) => (
                  <div key={skill.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-zorox-secondary">
                        {skill.label}
                      </span>
                      <span className="text-lg font-semibold text-zorox-secondary">
                        {skill.pct}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-zorox-bg">
                      <div
                        className="h-full rounded-full bg-zorox-accent transition-all duration-1000"
                        style={{ width: `${skill.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
