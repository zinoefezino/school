import { Schema, models, model, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code?: string;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, unique: true },
  code: { type: String, unique: true, sparse: true },
});

export default models.Subject || model<ISubject>("Subject", subjectSchema);
