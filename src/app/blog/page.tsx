import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const posts = [
  {
    img: "/img-news1.png",
    title: "Crafting seamless and intuitive digital experiences.",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: "/img-news2.png",
    title: "Shaping a brand that stands out and resonates.",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: "/img-news1.png",
    title:
      "The Role of Micro-Interactions in Enhancing User Experience",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: "/img-news2.png",
    title:
      "The Art of Minimalism: How Less Can Be More in Graphic Design",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: "/img-news1.png",
    title:
      "Mastering Color Psychology: Designing Graphics That Speak to Emotions",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: "/img-news2.png",
    title:
      "Designing for Accessibility: Creating Inclusive Digital Interfaces",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-zorox-bg py-16 md:py-24">
          <div className="mx-auto max-w-[1140px] px-4">
            <h4 className="mb-6 text-center">News &amp; Articles</h4>
            <p className="mx-auto mb-12 max-w-[600px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
              Insights, tutorials, and thought pieces on design, branding, and
              the creative industry.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-zorox-white transition-shadow hover:shadow-lg"
                >
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                  <div className="p-6">
                    <h5 className="mb-3">{post.title}</h5>
                    <p className="mb-4 text-sm leading-relaxed text-zorox-text">
                      {post.excerpt}
                    </p>
                    <Link
                      href="#"
                      className="text-sm font-semibold uppercase tracking-[1.2px] text-zorox-accent transition-colors hover:text-zorox-secondary"
                    >
                      Read More
                    </Link>
                  </div>
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
