import { Schema, models, model, Document, Types } from "mongoose";

export interface IAnnouncementRead extends Document {
  announcement: Types.ObjectId;
  user: Types.ObjectId;
  readAt: Date;
}

const announcementReadSchema = new Schema<IAnnouncementRead>({
  announcement: {
    type: Schema.Types.ObjectId,
    ref: "Announcement",
    required: true,
    index: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  readAt: { type: Date, default: Date.now },
});

announcementReadSchema.index({ announcement: 1, user: 1 }, { unique: true });

export default models.AnnouncementRead ||
  model<IAnnouncementRead>("AnnouncementRead", announcementReadSchema);
