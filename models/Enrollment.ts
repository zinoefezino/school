import { Schema, models, model, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  classSection: Types.ObjectId;
  term: Types.ObjectId;
  status: "ACTIVE" | "COMPLETED";
}

const enrollmentSchema = new Schema<IEnrollment>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  classSection: {
    type: Schema.Types.ObjectId,
    ref: "ClassSection",
    required: true,
  },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  status: { type: String, enum: ["ACTIVE", "COMPLETED"], default: "ACTIVE" },
});

enrollmentSchema.index({ student: 1, term: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ classSection: 1, status: 1 });
enrollmentSchema.index({ term: 1, status: 1 });

export default models.Enrollment ||
  model<IEnrollment>("Enrollment", enrollmentSchema);
