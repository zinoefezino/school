import { Schema, models, model, Document, Types } from "mongoose";

export interface IAssessment extends Document {
  student: Types.ObjectId;
  subject: Types.ObjectId;
  term: Types.ObjectId;
  scoreType: string; // e.g. "CA1", "Exam"
  score: number;
  submission?: Types.ObjectId;
}

const assessmentSchema = new Schema<IAssessment>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  scoreType: { type: String, required: true },
  score: { type: Number, required: true },
  submission: { type: Schema.Types.ObjectId, ref: "ResultSubmission" },
});

assessmentSchema.index(
  { student: 1, subject: 1, term: 1, scoreType: 1 },
  { unique: true },
);
assessmentSchema.index({ student: 1, term: 1 });
assessmentSchema.index({ subject: 1, term: 1 });

export default models.Assessment ||
  model<IAssessment>("Assessment", assessmentSchema);
