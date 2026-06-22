"use client";

import { useEffect, useState } from "react";
import { subscribe, type ToastItem, type ToastType } from "./toast";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const colorMap: Record<ToastType, string> = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  info: "border-zorox-accent bg-orange-50 text-orange-800",
};

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribe(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 rounded-xl border-l-4 px-4 py-3 shadow-lg ${
            colorMap[t.type]
          } ${t.exiting ? "animate-slide-out-right" : "animate-slide-in-right"}`}
        >
          <span className="shrink-0">{iconMap[t.type]}</span>
          <p className="text-sm font-medium">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
