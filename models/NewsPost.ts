import { Schema, models, model, Document, Types } from "mongoose";

export type NewsStatus = "DRAFT" | "PUBLISHED";

export interface INewsPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  category?: string;
  status: NewsStatus;
  publishedAt?: Date;
  publishedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const newsPostSchema = new Schema<INewsPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    coverImageUrl: String,
    category: { type: String, trim: true },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    publishedAt: Date,
    publishedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

newsPostSchema.index({ status: 1, publishedAt: -1 });
newsPostSchema.index({ slug: 1 }, { unique: true });
newsPostSchema.index({ title: 1 });
newsPostSchema.index({ category: 1 });

export default models.NewsPost || model<INewsPost>("NewsPost", newsPostSchema);
