import Header from "@/components/Header";
import Services from "@/components/Services";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Services />
        <PricingCards />
        <section className="bg-zorox-bg py-16 md:py-24">
          <div className="mx-auto max-w-[1140px] px-4">
            <h4 className="mb-8 text-center">The company I work with</h4>
            <p className="mx-auto mb-10 max-w-[700px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
              I&apos;ve had the privilege of working with a diverse range of
              clients, from startups to established businesses. Each
              collaboration has brought its unique challenges and rewards,
              shaping me into the designer I am today.
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex h-24 items-center justify-center rounded-2xl bg-zorox-white px-8">
                  <div className="h-8 w-full rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
