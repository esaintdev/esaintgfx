import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VisionMission from "@/components/VisionMission";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import ExperienceSkills from "@/components/ExperienceSkills";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VisionMission />
        <Stats />
        <Services />
        <ExperienceSkills />
        <Portfolio />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
