import { Schema, models, model, Document, Types } from "mongoose";

export interface IClassSection extends Document {
  name: string; // e.g. "Gold", "A"
  classLevel: Types.ObjectId;
}

const classSectionSchema = new Schema<IClassSection>({
  name: { type: String, required: true },
  classLevel: {
    type: Schema.Types.ObjectId,
    ref: "ClassLevel",
    required: true,
  },
});

classSectionSchema.index({ classLevel: 1, name: 1 }, { unique: true });

export default models.ClassSection ||
  model<IClassSection>("ClassSection", classSectionSchema);
