import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/helpers";

export const metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, design, and more.",
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();

  return (
    <section className="mt-8">
      <h1 className="">
        Discover How We Can Support You! Read our blog{" "}
        <span aria-hidden="true">→</span>
      </h1>
      <div className="flex flex-col">
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              className="mb-4  space-y-1  "
              href={`/blog/${post.slug}`}
            >
              {post.metadata.title}
            </Link>
          ))}
      </div>
    </section>
  );
}
