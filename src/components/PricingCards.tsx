import Link from "next/link";

const plans = [
  {
    name: "Hourly",
    price: "$64.9",
    unit: "/Hour",
    features: [
      "Free 3x All Design Consultation",
      "Maximum 2 type of design",
      "Maximum Revision 10 times",
    ],
  },
  {
    name: "Freelance",
    price: "$674.9",
    unit: "/Week",
    features: [
      "Free 3x All Design Consultation",
      "Maximum 2 type of design",
      "Maximum Revision 10 times",
    ],
  },
  {
    name: "Full Time",
    price: "$1550",
    unit: "/Month",
    features: [
      "Free 3x All Design Consultation",
      "Maximum 2 type of design",
      "Maximum Revision 10 times",
    ],
  },
];

export default function PricingCards() {
  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-12 text-center">Pricing &amp; Plans</h4>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl bg-zorox-white p-8 text-center transition-shadow hover:shadow-lg"
            >
              <h5 className="mb-6">{plan.name}</h5>
              <ul className="mb-8 space-y-3 text-left text-sm text-zorox-text md:text-base">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-zorox-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <span className="text-5xl font-semibold text-zorox-secondary">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-zorox-text">
                  {plan.unit}
                </span>
              </div>
              <Link
                href="#"
                className="inline-block rounded-full bg-zorox-accent px-10 py-[14px] text-sm font-semibold uppercase tracking-[-0.5px] text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
