import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Announcement, {
  type AnnouncementAudience,
} from "../../../models/Announcement";
import { getSession } from "../../../lib/session";

const allowedAudiences: AnnouncementAudience[] = ["STUDENT", "PARENT", "STAFF"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const params = new URL(request.url).searchParams;
  const page = Math.max(Number(params.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.get("limit") ?? 10), 1), 50);
  const requestedAudience = params.get("audience") as AnnouncementAudience | null;
  const audience =
    session.role === "ADMIN"
      ? requestedAudience && allowedAudiences.includes(requestedAudience)
        ? requestedAudience
        : null
      : session.role;
  const query = audience ? { audiences: { $in: [audience] } } : {};
  const [items, total] = await Promise.all([
    Announcement.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Announcement.countDocuments(query),
  ]);
  return NextResponse.json({
    announcements: items,
    page,
    limit,
    total,
    pages: Math.max(Math.ceil(total / limit), 1),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  if (session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Only admins can publish announcements." },
      { status: 403 },
    );

  try {
    const body = await request.json();
    const audiences: unknown[] = Array.isArray(body.audiences)
      ? [...new Set(body.audiences)]
      : [];

    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      typeof body.body !== "string" ||
      !body.body.trim() ||
      audiences.length === 0 ||
      audiences.some(
        (audience) =>
          !allowedAudiences.includes(audience as AnnouncementAudience),
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Title, message, and at least one valid audience are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();
    const announcement = await Announcement.create({
      title: body.title.trim(),
      body: body.body.trim(),
      audiences,
      publishedBy: "Admin",
    });

    return NextResponse.json(
      { id: announcement._id.toString() },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to publish announcement." },
      { status: 500 },
    );
  }
}
