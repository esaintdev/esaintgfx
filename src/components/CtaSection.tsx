import Link from "next/link";
import OpenChatButton from "./OpenChatButton";

interface CtaSectionProps {
  heading: string;
  description?: string;
  buttonLabel: string;
  buttonHref?: string;
  dark?: boolean;
  openChat?: boolean;
}

export default function CtaSection({
  heading,
  description,
  buttonLabel,
  buttonHref = "/contact",
  dark,
  openChat,
}: CtaSectionProps) {
  const className = `inline-block rounded-full px-12 py-[18px] text-lg font-semibold uppercase tracking-[-1.2px] transition-colors ${
    dark
      ? "bg-zorox-accent text-white hover:bg-zorox-accent/90"
      : "bg-zorox-accent text-white hover:bg-zorox-secondary hover:text-zorox-accent"
  }`;

  if (openChat) {
    return (
      <section className={`py-20 text-center ${dark ? "bg-zorox-secondary" : "bg-zorox-bg"}`}>
        <div className="mx-auto max-w-[720px] px-4">
          <h4 className={`mb-4 ${dark ? "text-white" : ""}`}>{heading}</h4>
          {description && (
            <p className="mb-8 text-sm leading-relaxed text-zorox-text md:text-base">
              {description}
            </p>
          )}
          <OpenChatButton className={className}>
            {buttonLabel}
          </OpenChatButton>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 text-center ${dark ? "bg-zorox-secondary" : "bg-zorox-bg"}`}>
      <div className="mx-auto max-w-[720px] px-4">
        <h4 className={`mb-4 ${dark ? "text-white" : ""}`}>{heading}</h4>
        {description && (
          <p className="mb-8 text-sm leading-relaxed text-zorox-text md:text-base">
            {description}
          </p>
        )}
        <Link href={buttonHref} className={className}>
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
