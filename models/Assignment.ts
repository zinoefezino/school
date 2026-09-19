import { Schema, models, model, Document, Types } from "mongoose";

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IAssignment extends Document {
  title: string;
  description?: string;
  subject: Types.ObjectId;
  classSection: Types.ObjectId;
  term: Types.ObjectId;
  teacher?: Types.ObjectId;
  dueDate: Date;
  status: AssignmentStatus;
  submittedBy: Types.ObjectId[];
  createdAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true, trim: true },
  description: String,
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  classSection: {
    type: Schema.Types.ObjectId,
    ref: "ClassSection",
    required: true,
  },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Staff" },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    default: "PUBLISHED",
  },
  submittedBy: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
});

assignmentSchema.index({ classSection: 1, term: 1, dueDate: 1 });

export default models.Assignment ||
  model<IAssignment>("Assignment", assignmentSchema);
