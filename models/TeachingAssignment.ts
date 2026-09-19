import { Schema, models, model, Document, Types } from "mongoose";

export interface ITeachingAssignment extends Document {
  classSection: Types.ObjectId;
  subject: Types.ObjectId;
  teacher: Types.ObjectId;
  assignedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teachingAssignmentSchema = new Schema<ITeachingAssignment>(
  {
    classSection: {
      type: Schema.Types.ObjectId,
      ref: "ClassSection",
      required: true,
    },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

teachingAssignmentSchema.index(
  { classSection: 1, subject: 1 },
  { unique: true },
);
teachingAssignmentSchema.index({ teacher: 1, classSection: 1 });

export default models.TeachingAssignment ||
  model<ITeachingAssignment>("TeachingAssignment", teachingAssignmentSchema);
