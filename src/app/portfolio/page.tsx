import Header from "@/components/Header";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main>
        <Portfolio />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
