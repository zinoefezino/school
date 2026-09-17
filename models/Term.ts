import { Schema, models, model, Document, Types } from "mongoose";

export interface ITerm extends Document {
  name: string; // e.g. "First Term"
  session: Types.ObjectId;
  resultsPublished: boolean;
}

const termSchema = new Schema<ITerm>({
  name: { type: String, required: true },
  session: {
    type: Schema.Types.ObjectId,
    ref: "AcademicSession",
    required: true,
  },
  resultsPublished: { type: Boolean, default: false },
});

termSchema.index({ session: 1, name: 1 }, { unique: true });

export default models.Term || model<ITerm>("Term", termSchema);
