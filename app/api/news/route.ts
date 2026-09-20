import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "../../../lib/mongodb";
import { getSession } from "../../../lib/session";
import { writeAuditLog } from "../../../lib/audit";
import NewsPost, { type NewsStatus } from "../../../models/NewsPost";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string) {
  const cleanBase = slugify(base) || `news-${Date.now()}`;
  let slug = cleanBase;
  let counter = 2;
  while (await NewsPost.exists({ slug })) {
    slug = `${cleanBase}-${counter}`;
    counter += 1;
  }
  return slug;
}

function normalizeStatus(value: unknown): NewsStatus {
  return value === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const session = await getSession();
  const params = new URL(request.url).searchParams;
  const includeDrafts = params.get("includeDrafts") === "true";
  const page = Math.max(Number(params.get("page") ?? 1) || 1, 1);
  const limit = Math.min(Number(params.get("limit") ?? 20) || 20, 50);
  const search = params.get("search")?.trim();
  const status = params.get("status");

  if (includeDrafts && session?.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  await connectDB();
  const query: Record<string, unknown> = includeDrafts
    ? {}
    : { status: "PUBLISHED" };
  if (includeDrafts && (status === "PUBLISHED" || status === "DRAFT"))
    query.status = status;
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { category: regex }];
  }
  const [posts, total] = await Promise.all([
    NewsPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    NewsPost.countDocuments(query),
  ]);
  return NextResponse.json(
    { posts, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Only admins can publish news." },
      { status: 403 },
    );

  const body = await request.json();
  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.excerpt !== "string" ||
    !body.excerpt.trim() ||
    typeof body.body !== "string" ||
    !body.body.trim()
  )
    return NextResponse.json(
      { error: "Title, excerpt, and story body are required." },
      { status: 400 },
    );

  await connectDB();
  const status = normalizeStatus(body.status);
  const post = await NewsPost.create({
    title: body.title.trim(),
    slug: await uniqueSlug(
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : body.title,
    ),
    excerpt: body.excerpt.trim(),
    body: body.body.trim(),
    coverImageUrl:
      typeof body.coverImageUrl === "string" && body.coverImageUrl.trim()
        ? body.coverImageUrl.trim()
        : undefined,
    category:
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : undefined,
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    publishedBy: session.userId,
  });

  if (status === "PUBLISHED") {
    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/news/${post.slug}`);
  }

  await writeAuditLog({
    session,
    action: status === "PUBLISHED" ? "admin.news.publish" : "admin.news.draft",
    targetType: "NewsPost",
    targetId: post._id.toString(),
    metadata: { slug: post.slug, title: post.title, status },
  });

  return NextResponse.json({ post }, { status: 201 });
}
