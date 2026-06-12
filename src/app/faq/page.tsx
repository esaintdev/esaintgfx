import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import CtaSection from "@/components/CtaSection";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        <FAQ />
        <CtaSection
          heading="Are you ready to bring your ideas to life?"
          description="Let's create something amazing together! Whether you need a captivating logo, a seamless user interface, or a full-scale branding overhaul, I'm here to help. Contact me to discuss your project and let's turn your vision into reality."
          buttonLabel="Lets Talk!"
          openChat
        />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
