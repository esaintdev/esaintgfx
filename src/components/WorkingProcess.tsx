const steps = [
  {
    icon: "/icon-Vector-Graphics.png",
    title: "Researching",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper.",
  },
  {
    icon: "/icon-Design-Elements.png",
    title: "Good concept",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper.",
  },
  {
    icon: "/icon-Branding.png",
    title: "Development",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper.",
  },
];

export default function WorkingProcess() {
  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-12 text-center">Working Process</h4>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl bg-zorox-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zorox-primary/30">
                <span className="text-2xl font-bold text-zorox-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h5 className="mb-3">{step.title}</h5>
              <p className="text-sm leading-relaxed text-zorox-text md:text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
