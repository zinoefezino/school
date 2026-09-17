import { Schema, models, model, Document } from "mongoose";

export interface IClassLevel extends Document {
  name: string; // e.g. "JSS1", "SS2"
}

const classLevelSchema = new Schema<IClassLevel>({
  name: { type: String, required: true, unique: true },
});

export default models.ClassLevel ||
  model<IClassLevel>("ClassLevel", classLevelSchema);
