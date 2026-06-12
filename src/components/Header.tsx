"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Homepage", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  {
    label: "Pages",
    href: "#",
    children: [
      { label: "Pricing", href: "/pricing" },
      { label: "Testimonial", href: "/testimonial" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-zorox-bg">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-4 py-4 lg:py-6">
        <Link href="/">
          <img
            src="/logo-zorox.png"
            alt="Zorox"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <div key={link.label} className="group relative">
              <Link
                href={link.href}
                className="text-sm font-medium uppercase tracking-[1.2px] text-zorox-secondary transition-colors hover:text-zorox-accent"
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="absolute left-0 top-full z-50 mt-2 hidden w-48 rounded-lg bg-white shadow-lg group-hover:block">
                  <div className="flex flex-col py-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="px-4 py-2 text-sm text-zorox-text transition-colors hover:text-zorox-accent"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => (window as any).__openChat?.()}
            className="rounded-full bg-zorox-accent px-10 py-[14px] text-sm font-semibold uppercase tracking-[-0.5px] text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
          >
            Hire Me!
          </button>
        </nav>

        <button
          className="flex flex-col gap-[5px] lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-zorox-secondary" />
          <span className="block h-0.5 w-6 bg-zorox-secondary" />
          <span className="block h-0.5 w-6 bg-zorox-secondary" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zorox-bg px-4 pt-4 lg:hidden">
          <div className="flex justify-end">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-3xl text-zorox-secondary"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="text-lg font-medium uppercase tracking-[1.2px] text-zorox-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="text-base text-zorox-text"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => { setMobileOpen(false); (window as any).__openChat?.(); }}
              className="mt-4 w-fit rounded-full bg-zorox-accent px-10 py-[14px] text-sm font-semibold uppercase text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
            >
              Hire Me!
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
