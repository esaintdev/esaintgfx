export default function VisionMission() {
  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4">
        <h2 className="mb-8 text-center md:mb-16">Creative Design with Refreshing Ideas</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-start gap-6 rounded-[48px] bg-zorox-white p-10 md:flex-row md:p-12">
            <img
              src="/img-vision.png"
              alt="Vision"
              className="h-20 w-20 shrink-0 object-contain md:h-28 md:w-28"
            />
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[1.2px] text-zorox-accent">
                Our Vision
              </p>
              <p className="text-sm leading-relaxed text-zorox-text md:text-[24px] md:leading-relaxed md:tracking-[-1.2px]">
                To craft visually compelling digital experiences that bridge the
                gap between aesthetics and functionality, empowering brands to
                communicate their unique stories with clarity and impact.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 rounded-[48px] bg-zorox-white p-10 md:flex-row md:p-12">
            <img
              src="/img-mission.png"
              alt="Mission"
              className="h-20 w-20 shrink-0 object-contain md:h-28 md:w-28"
            />
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[1.2px] text-zorox-accent">
                Our Mission
              </p>
              <p className="text-sm leading-relaxed text-zorox-text md:text-[24px] md:leading-relaxed md:tracking-[-1.2px]">
                To deliver pixel-perfect design solutions that exceed client
                expectations, combining innovative thinking with technical
                expertise to build brands that leave a lasting impression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
