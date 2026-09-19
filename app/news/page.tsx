import Link from "next/link";
import { connection } from "next/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { connectDB } from "../../lib/mongodb";
import NewsPost from "../../models/NewsPost";

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

export default async function NewsPage() {
  await connection();
  await connectDB();
  const posts = (await NewsPost.find({ status: "PUBLISHED" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean()) as unknown as NewsCard[];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-blue-light/35">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            {/* <p className="text-sm font-medium uppercase tracking-wide text-blue">
              School news
            </p> */}
            <h1 className="mt-3 text-4xl font-bold text-foreground">
              News and events
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70">
              Public stories, achievements, event updates, and school community
              notices.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          {posts.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-navy/20 p-8 text-sm text-foreground/60">
              No news has been published yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/news/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-navy/10 bg-white transition-transform hover:-translate-y-1"
                >
                  <div className="relative h-56 bg-blue-light">
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
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-foreground">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/65">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
