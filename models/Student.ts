import { Schema, models, model, Document, Types } from "mongoose";

export interface IStudent extends Document {
  user: Types.ObjectId;
  admissionNumber: string;
  fullName: string;
  dateOfBirth: Date;
  gender?: "male" | "female";
  photoUrl?: string;
  guardian?: Types.ObjectId;
}

const studentSchema = new Schema<IStudent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  admissionNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"] },
  photoUrl: String,
  guardian: { type: Schema.Types.ObjectId, ref: "Guardian" },
});

export default models.Student || model<IStudent>("Student", studentSchema);
