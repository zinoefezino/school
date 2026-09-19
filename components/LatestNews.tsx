import Link from "next/link";
import { connection } from "next/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { connectDB } from "../lib/mongodb";
import NewsPost from "../models/NewsPost";

type NewsCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  category?: string;
  publishedAt?: string | Date;
};

function formatDate(value?: string | Date) {
  return value ? new Date(value).toLocaleDateString() : "School news";
}

export default async function LatestNews() {
  await connection();
  await connectDB();
  const posts = (await NewsPost.find({ status: "PUBLISHED" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean()) as unknown as NewsCard[];

  return (
    <section id="news" className="bg-blue-light/35">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            {/* <p className="text-sm font-medium uppercase tracking-wide text-blue">
              News
            </p> */}
            <h2 className="mt-2 text-3xl font-bold leading-tight text-foreground">
              Latest school news and events
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              Follow public updates, celebrations, and important stories from
              our school.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View all news
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-3xl bg-white p-8 text-sm text-foreground/60">
            No public news has been published yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/news/${post.slug}`}
                className="group overflow-hidden rounded-3xl bg-white ring-1 ring-navy/10 transition-transform hover:-translate-y-1"
              >
                <div className="relative h-52 bg-blue-light">
                  {post.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-foreground/50">
                      School news
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-foreground/50">
                    <HugeiconsIcon icon={Calendar03Icon} size={14} />
                    {formatDate(post.publishedAt)}
                    {post.category ? ` · ${post.category}` : ""}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/65">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
