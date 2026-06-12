"use client";

import { useEffect, useState } from "react";

const stats = [
  { label: "Complete Project", suffix: "+", value: 0 },
  { label: "Years Experience", suffix: "+", value: 0 },
  { label: "Happy Clients", suffix: "+", value: 0 },
  { label: "Awards Winning", suffix: "+", value: 0 },
];

export default function Stats() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [50, 12, 120, 8];
    const duration = 2000;
    const startTime = performance.now();

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCounts(targets.map((t) => Math.floor(t * progress)));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <h2>
                {counts[i]}
                {stat.suffix}
              </h2>
              <p className="text-base text-zorox-text md:text-[24px] md:tracking-[-1.2px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
