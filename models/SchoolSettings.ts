import { Schema, models, model, Document } from "mongoose";

export interface ISchoolSettings extends Document {
  key: string;
  schoolName: string;
  currentSession: string;
  notifyResultsReview: boolean;
}

const schoolSettingsSchema = new Schema<ISchoolSettings>({
  key: { type: String, unique: true, default: "default" },
  schoolName: { type: String, required: true, default: "Fairview Academy" },
  currentSession: { type: String, required: true, default: "2026/2027" },
  notifyResultsReview: { type: Boolean, default: true },
});

export default models.SchoolSettings ||
  model<ISchoolSettings>("SchoolSettings", schoolSettingsSchema);
