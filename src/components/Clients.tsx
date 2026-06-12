export default function Clients() {
  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-8 text-center">The company I work with</h4>
        <p className="mx-auto mb-10 max-w-[700px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
          I&apos;ve had the privilege of working with a diverse range of
          clients, from startups to established businesses. Each collaboration
          has brought its unique challenges and rewards, shaping me into the
          designer I am today. Here are a few areas where my work has made an
          impact:
        </p>
        <div className="mx-auto mb-12 max-w-[600px] space-y-4">
          {[
            "Tech startups looking to redefine user experiences",
            "Local Indonesian businesses embracing modern branding",
            "International clients seeking illustrations with a cultural flair",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zorox-accent" />
              <span className="text-sm text-zorox-text md:text-base">
                {item}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-24 items-center justify-center rounded-2xl bg-zorox-white px-8"
            >
              <div className="h-8 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
