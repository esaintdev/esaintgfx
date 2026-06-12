import Header from "@/components/Header";
import Stats from "@/components/Stats";
import VisionMission from "@/components/VisionMission";
import FAQ from "@/components/FAQ";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-zorox-bg py-16 md:py-24">
          <div className="mx-auto max-w-[1140px] px-4">
            <h1 className="mb-8 max-w-[800px]">
              I&apos;m Zorox, a Website &amp; Graphic Designer from Indonesia
            </h1>
            <div className="grid gap-16 md:grid-cols-2">
              <div>
                <h5 className="mb-4 uppercase tracking-[1.2px] text-zorox-accent">
                  Biography
                </h5>
                <p className="mb-6 text-sm leading-relaxed text-zorox-text md:text-base">
                  Born and raised in Indonesia, my journey into the world of
                  design started with a simple sketchbook and a vivid
                  imagination. Over the years, I&apos;ve honed my craft, drawing
                  inspiration from Indonesia&apos;s rich culture, diverse
                  landscapes, and innovative communities. Today, I stand as a
                  designer who thrives on challenges and embraces the
                  opportunity to transform visions into reality.
                </p>
                <Link
                  href="#"
                  className="inline-block rounded-full bg-zorox-accent px-10 py-[14px] text-sm font-semibold uppercase text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
                >
                  More About Me
                </Link>
              </div>
              <div>
                <h5 className="mb-4 uppercase tracking-[1.2px] text-zorox-accent">
                  My Journey
                </h5>
                <p className="text-sm leading-relaxed text-zorox-text md:text-base">
                  From my first freelance project to collaborating with global
                  brands, every step of my journey has been a learning
                  experience. I&apos;ve explored various design disciplines,
                  including UI/UX design, branding, logo creation, and
                  illustration. My growth as a designer has been fueled by a
                  relentless pursuit of excellence and a passion for storytelling
                  through design. Whether it&apos;s creating user-friendly
                  interfaces or crafting illustrations that speak a thousand
                  words, I take pride in every project I undertake.
                </p>
              </div>
            </div>
          </div>
        </section>
        <VisionMission />
        <Stats />
        <section className="bg-zorox-bg py-16 md:py-24">
          <div className="mx-auto max-w-[1140px] px-4">
            <h4 className="mb-8 text-center">The company I work with</h4>
            <p className="mx-auto mb-10 max-w-[700px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
              I&apos;ve had the privilege of working with a diverse range of
              clients, from startups to established businesses. Each
              collaboration has brought its unique challenges and rewards,
              shaping me into the designer I am today. Here are a few areas
              where my work has made an impact:
            </p>
            <div className="mx-auto mb-12 max-w-[600px] space-y-4">
              {[
                "Tech startups looking to redefine user experiences",
                "Local Indonesian businesses embracing modern branding",
                "International clients seeking illustrations with a cultural flair",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zorox-accent" />
                  <span className="text-sm text-zorox-text md:text-base">{item}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex h-24 items-center justify-center rounded-2xl bg-zorox-white px-8">
                  <div className="h-8 w-full rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <CtaSection
          heading="Are you ready to bring your ideas to life?"
          description="Let's create something amazing together! Whether you need a captivating logo, a seamless user interface, or a full-scale branding overhaul, I'm here to help. Contact me to discuss your project and let's turn your vision into reality."
          buttonLabel="Lets Talk!"
          openChat
        />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
