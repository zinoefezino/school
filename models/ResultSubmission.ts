import { Schema, models, model, Document, Types } from "mongoose";

export type SubmissionStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export interface IResultSubmission extends Document {
  subject: Types.ObjectId;
  classSection: Types.ObjectId;
  term: Types.ObjectId;
  teacher: Types.ObjectId;
  status: SubmissionStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  rejectionNote?: string;
}

const resultSubmissionSchema = new Schema<IResultSubmission>({
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  classSection: {
    type: Schema.Types.ObjectId,
    ref: "ClassSection",
    required: true,
  },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
  status: {
    type: String,
    enum: ["SUBMITTED", "APPROVED", "REJECTED"],
    default: "SUBMITTED",
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  rejectionNote: String,
});

resultSubmissionSchema.index(
  { subject: 1, classSection: 1, term: 1 },
  { unique: true },
);

export default models.ResultSubmission ||
  model<IResultSubmission>("ResultSubmission", resultSubmissionSchema);
