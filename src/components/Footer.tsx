import Link from "next/link";
import OpenChatButton from "./OpenChatButton";

const footerLinks = [
  "Home",
  "About",
  "Services",
  "Portfolio",
  "Pricing",
  "Testimonials",
];

export default function Footer() {
  return (
    <footer>
      <section className="bg-zorox-secondary py-20 text-center">
        <h2 className="mb-8 px-4 text-white">
          Lets Start Making Something Amazing Together.
        </h2>
        <OpenChatButton className="inline-block rounded-full bg-zorox-accent px-12 py-[18px] text-lg font-semibold uppercase tracking-[-1.2px] text-white transition-colors hover:bg-zorox-accent/90">
          Start a Project
        </OpenChatButton>
      </section>

      <section className="bg-zorox-bg py-16">
        <div className="mx-auto max-w-[1140px] px-4 text-center">
          <div className="mb-8">
            <h5 className="mb-2">Email</h5>
            <p className="text-zorox-text">esaint.designer@gmail.com</p>
          </div>
          <div className="mb-8">
            <h5 className="mb-2">Phone</h5>
            <p className="text-zorox-text">+2348121855275</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold uppercase tracking-[1.2px] text-zorox-secondary">
            {footerLinks.map((link) => (
              <Link key={link} href="#" className="hover:text-zorox-accent">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 bg-zorox-bg py-6 text-center">
        <p className="text-xs text-zorox-text">
          COPYRIGHT &copy; ESAINT 2025. ALL RIGHTS RESERVED.
        </p>
      </section>
    </footer>
  );
}
