"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Image01Icon,
  Megaphone01Icon,
} from "@hugeicons/core-free-icons";
import LoadingState from "../../components/LoadingState";
import StatusMessage from "../../components/StatusMessage";

type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  category?: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  createdAt?: string;
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [postStatus, setPostStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const params = new URLSearchParams({
      includeDrafts: "true",
      limit: "10",
      page: String(page),
    });
    if (search.trim()) params.set("search", search.trim());
    if (postStatus) params.set("status", postStatus);
    const response = await fetch(`/api/news?${params.toString()}`);
    const data = response.ok ? await response.json() : { posts: [] };
    setPosts(data.posts ?? []);
    setPages(data.pages ?? 1);
    setTotal(data.total ?? 0);
  }, [page, postStatus, search]);

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [load]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save news.");
      form.reset();
      setStatus("News post saved.");
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save news.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (post: NewsPost) => {
    const confirmed = window.confirm(`Delete "${post.title}"?`);
    if (!confirmed) return;
    setDeletingSlug(post.slug);
    setStatus("");
    try {
      const response = await fetch(`/api/news/${post.slug}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to delete news post.");
      setPosts((current) => current.filter((item) => item.slug !== post.slug));
      setTotal((current) => Math.max(0, current - 1));
      setStatus("News post deleted.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to delete news post.",
      );
    } finally {
      setDeletingSlug("");
    }
  };

  if (loading) return <LoadingState label="Loading news..." />;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,460px)_1fr]">
      <form
        onSubmit={submit}
        className="rounded-2xl border border-navy/10 bg-white p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-blue">
            <HugeiconsIcon icon={Megaphone01Icon} size={20} />
          </span>
          <div>
            <h1 className="text-lg font-medium text-foreground">
              Publish news
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Public homepage and news page content.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <input
            required
            name="title"
            placeholder="News title"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <input
            name="slug"
            placeholder="Optional URL slug"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <input
            name="category"
            placeholder="Category e.g. Events, Admissions"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <input
            name="coverImageUrl"
            placeholder="Cover photo URL"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <textarea
            required
            name="excerpt"
            rows={3}
            placeholder="Short summary"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <textarea
            required
            name="body"
            rows={8}
            placeholder="Full news story"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <select
            name="status"
            defaultValue="PUBLISHED"
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="PUBLISHED">Publish now</option>
            <option value="DRAFT">Save as draft</option>
          </select>
        </div>

        {status && <StatusMessage className="mt-4">{status}</StatusMessage>}
        <button
          disabled={submitting}
          className="mt-5 flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {submitting ? "Saving..." : "Save news"}
        </button>
      </form>

      <section className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">News posts</h2>
            <p className="mt-1 text-sm text-foreground/60">
              {total.toLocaleString()} posts found
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search title, summary, or category"
            className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-blue"
          />
          <select
            value={postStatus}
            onChange={(event) => {
              setPostStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">All status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <div className="mt-4 divide-y divide-black/5">
          {posts.length === 0 ? (
            <p className="py-8 text-sm text-foreground/60">
              No news posts yet.
            </p>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="flex gap-4 py-4">
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-light text-blue">
                  {post.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <HugeiconsIcon icon={Image01Icon} size={22} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {post.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        post.status === "PUBLISHED"
                          ? "bg-[#3F7A5B]/10 text-[#3F7A5B]"
                          : "bg-foreground/10 text-foreground/60"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    {post.status === "PUBLISHED" && (
                      <a
                        href={`/news/${post.slug}`}
                        target="_blank"
                        className="font-medium text-blue"
                      >
                        View public page
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={deletingSlug === post.slug}
                      onClick={() => remove(post)}
                      className="flex items-center gap-1 font-medium text-[#B4483B] disabled:opacity-40"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                      {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        {pages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5">
            <p className="text-sm text-foreground/60">
              Page {page} of {pages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page === pages}
                onClick={() =>
                  setPage((current) => Math.min(pages, current + 1))
                }
                className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
