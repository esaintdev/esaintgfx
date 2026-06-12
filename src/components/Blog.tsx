"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const fallbackPosts = [
  {
    img: "/img-news1.png",
    title: "Crafting seamless and intuitive digital experiences.",
    excerpt: "Discover the key principles behind designing user interfaces that feel natural, reduce friction, and keep users coming back for more.",
  },
  {
    img: "/img-news2.png",
    title: "Shaping a brand that stands out and resonates.",
    excerpt: "Learn how strategic brand identity development can differentiate your business and create meaningful connections with your audience.",
  },
];

export default function Blog() {
  const supabase = createClient();
  const [posts, setPosts] = useState<{ img: string; title: string; excerpt: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) { setPosts(fallbackPosts); setLoaded(true); return; }
    supabase.from("blog_posts").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setPosts(data.map((p: any) => ({ img: p.img, title: p.title, excerpt: p.excerpt })));
      } else {
        setPosts(fallbackPosts);
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-zorox-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1140px] px-4">
        <h4 className="mb-6 text-center">News &amp; Articles</h4>
        <p className="mx-auto mb-12 max-w-[600px] text-center text-sm leading-relaxed text-zorox-text md:text-base">
          Insights, tutorials, and thought pieces on design, branding, and the
          creative industry.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.title}
              className="overflow-hidden rounded-2xl bg-zorox-white"
            >
              <img
                src={post.img}
                alt={post.title}
                className="w-full object-cover"
              />
              <div className="p-8">
                <h5 className="mb-4">{post.title}</h5>
                <p className="mb-6 text-sm leading-relaxed text-zorox-text">
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
  );
}
