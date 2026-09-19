import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Announcement from "../../../../models/Announcement";
import AnnouncementRead from "../../../../models/AnnouncementRead";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );

  if (session.role === "ADMIN")
    return NextResponse.json({ announcements: 0 });

  await connectDB();

  const userId = new Types.ObjectId(session.userId);
  const visibleAnnouncements = await Announcement.find(
    { audiences: { $in: [session.role] } },
    { _id: 1 },
  ).lean();
  const announcementIds = visibleAnnouncements.map((item) => item._id);

  if (announcementIds.length === 0)
    return NextResponse.json({ announcements: 0 });

  const readCount = await AnnouncementRead.countDocuments({
    user: userId,
    announcement: { $in: announcementIds },
  });

  return NextResponse.json({
    announcements: Math.max(announcementIds.length - readCount, 0),
  });
}
