import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { connectDB } from "../../../lib/mongodb";
import NewsPost from "../../../models/NewsPost";

type NewsPostView = {
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  category?: string;
  publishedAt?: string | Date;
};

function formatDate(value?: string | Date) {
  return value ? new Date(value).toLocaleDateString() : "School news";
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const post = (await NewsPost.findOne({
    slug,
    status: "PUBLISHED",
  }).lean()) as unknown as NewsPostView | null;

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <article>
          <section className="bg-blue-light/35">
            <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <HugeiconsIcon icon={Calendar03Icon} size={16} />
                {formatDate(post.publishedAt)}
                {post.category ? ` · ${post.category}` : ""}
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground">
                {post.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-foreground/70">
                {post.excerpt}
              </p>
            </div>
          </section>

          {post.coverImageUrl && (
            <div className="mx-auto mt-10 max-w-5xl px-6">
              <div className="relative h-[420px] overflow-hidden rounded-3xl bg-blue-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <section className="mx-auto max-w-3xl px-6 py-14">
            <div className="whitespace-pre-line text-base leading-8 text-foreground/75">
              {post.body}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
