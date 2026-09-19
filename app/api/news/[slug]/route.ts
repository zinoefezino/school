import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import NewsPost from "../../../../models/NewsPost";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await connectDB();
  const post = await NewsPost.findOne({ slug, status: "PUBLISHED" }).lean();
  if (!post)
    return NextResponse.json({ error: "News post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Admin authentication is required." },
      { status: 401 },
    );

  const { slug } = await params;
  await connectDB();
  const result = await NewsPost.deleteOne({ slug });
  if (result.deletedCount === 0)
    return NextResponse.json({ error: "News post not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
