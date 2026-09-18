import { Schema, models, model, Document } from "mongoose";

export type AnnouncementAudience = "STUDENT" | "PARENT" | "STAFF";

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  audiences: AnnouncementAudience[];
  publishedAt: Date;
  publishedBy: string;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true },
  audiences: {
    type: [String],
    enum: ["STUDENT", "PARENT", "STAFF"],
    required: true,
  },
  publishedAt: { type: Date, default: Date.now },
  publishedBy: { type: String, required: true },
});

export default models.Announcement ||
  model<IAnnouncement>("Announcement", announcementSchema);
