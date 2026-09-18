import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Announcement, {
  type AnnouncementAudience,
} from "../../../models/Announcement";
import { getSession } from "../../../lib/session";

const allowedAudiences: AnnouncementAudience[] = ["STUDENT", "PARENT", "STAFF"];

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  await connectDB();
  const audience = session.role === "ADMIN" ? null : session.role;
  const query = audience ? { audiences: { $in: [audience] } } : {};
  const items = await Announcement.find(query).sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ announcements: items });
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
