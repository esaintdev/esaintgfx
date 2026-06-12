import OpenChatButton from "./OpenChatButton";

export default function Hero() {
  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-12 px-4 md:flex-row">
        <div className="w-full shrink-0 md:w-[342px]">
          <img
            src="/img-profile.png"
            alt="Profile"
            className="w-full max-w-[342px]"
          />
        </div>
        <div>
          <h1 className="mb-6">Website & Graphic Designer</h1>
          <p className="mb-8 max-w-[600px] text-lg leading-relaxed text-zorox-text md:text-[24px] md:leading-relaxed md:tracking-[-1.2px]">
            I am a Professional Website & Graphic Designer. This website
            contains design works that I have produced over the past few years.
            Find various types of design projects such as logo designs, brochure
            designs, product packaging designs, website designs, and many more.
          </p>
          <OpenChatButton className="inline-block rounded-full bg-zorox-accent px-12 py-[18px] text-lg font-semibold uppercase tracking-[-1.2px] text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent">
            Let&apos;s Talk
          </OpenChatButton>
        </div>
      </div>
    </section>
  );
}
