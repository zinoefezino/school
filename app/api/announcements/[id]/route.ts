import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import { writeAuditLog } from "../../../../lib/audit";
import Announcement from "../../../../models/Announcement";
import AnnouncementRead from "../../../../models/AnnouncementRead";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 },
    );
  if (session.role !== "ADMIN")
    return NextResponse.json(
      { error: "Only admins can delete announcements." },
      { status: 403 },
    );

  const { id } = await params;
  if (!Types.ObjectId.isValid(id))
    return NextResponse.json(
      { error: "Invalid announcement." },
      { status: 400 },
    );

  await connectDB();
  const result = await Announcement.deleteOne({ _id: id });
  if (result.deletedCount === 0)
    return NextResponse.json(
      { error: "Announcement not found." },
      { status: 404 },
    );

  await AnnouncementRead.deleteMany({ announcement: id });
  await writeAuditLog({
    session,
    action: "admin.announcement.delete",
    targetType: "Announcement",
    targetId: id,
  });

  return NextResponse.json({ deleted: true });
}
