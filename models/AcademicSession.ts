import { Schema, models, model, Document } from "mongoose";

export interface IAcademicSession extends Document {
  name: string; // e.g. "2026/2027"
}

const academicSessionSchema = new Schema<IAcademicSession>({
  name: { type: String, required: true, unique: true },
});

export default models.AcademicSession ||
  model<IAcademicSession>("AcademicSession", academicSessionSchema);
