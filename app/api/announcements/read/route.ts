import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import Announcement from "../../../../models/Announcement";
import AnnouncementRead from "../../../../models/AnnouncementRead";

export async function POST() {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );

  if (session.role === "ADMIN")
    return NextResponse.json({ read: 0 });

  await connectDB();

  const visibleAnnouncements = await Announcement.find(
    { audiences: { $in: [session.role] } },
    { _id: 1 },
  ).lean();
  const now = new Date();
  const userId = new Types.ObjectId(session.userId);
  const operations = visibleAnnouncements.map((announcement) => ({
    updateOne: {
      filter: { announcement: announcement._id, user: userId },
      update: {
        $setOnInsert: {
          announcement: announcement._id,
          user: userId,
          readAt: now,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await AnnouncementRead.bulkWrite(operations, { ordered: false });
  }

  return NextResponse.json({ read: operations.length });
}
