import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-zorox-bg py-16 md:py-24">
          <div className="mx-auto max-w-[1140px] px-4">
            <h4 className="mb-12 text-center">Get In Touch With Me</h4>
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-10">
                {[
                  { label: "Address", value: "Jl. Contoh No. 123, Jakarta, Indonesia" },
                  { label: "Email", value: "hello@zorox.com" },
                  { label: "Phone", value: "(+62) 812 345 678" },
                ].map((item) => (
                  <div key={item.label}>
                    <h5 className="mb-2 uppercase tracking-[1.2px] text-zorox-accent">
                      {item.label}
                    </h5>
                    <p className="text-sm text-zorox-text md:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <h5 className="mb-6">Send Me a Message</h5>
                <form className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zorox-secondary">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-zorox-white px-5 py-4 text-sm outline-none transition-colors focus:border-zorox-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zorox-secondary">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 bg-zorox-white px-5 py-4 text-sm outline-none transition-colors focus:border-zorox-accent"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zorox-secondary">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full rounded-xl border border-gray-200 bg-zorox-white px-5 py-4 text-sm outline-none transition-colors focus:border-zorox-accent"
                      placeholder="Your message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-zorox-accent px-12 py-[18px] text-lg font-semibold uppercase tracking-[-1.2px] text-white transition-colors hover:bg-zorox-secondary hover:text-zorox-accent"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
