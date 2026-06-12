import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import PortfolioDetail from "@/components/PortfolioDetail";

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <main>
        <PortfolioDetail id={id} />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
