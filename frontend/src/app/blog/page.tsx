import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blogs",
  description: "A dreams Interpretation",
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();

  return (
    <div className="p-8">
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
    </div>
  );
}
